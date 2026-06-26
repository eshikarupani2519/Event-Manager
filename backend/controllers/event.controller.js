const db = require("../models/db"); // your MySQL pool
const crypto = require("crypto");
const razorpay = require("../services/razorPayService");
const { v4: uuidv4 } = require("uuid")

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const [events] = await db.query(`SELECT * FROM events WHERE activeYN=1`);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching events" });
  }
};


exports.addEvent = async (req, res) => {
  try {

    const {
      event_name,
      event_description,
      event_date,
      timing,
      event_type,
      event_category = [],
      event_mode,
      location,
      total_seats,
      ticket_price = 0
    } = req.body;

    // Validate online/offline
    if (!["Online", "Offline"].includes(event_mode)) {
      return res.status(400).json({ message: "event_mode must be Online or Offline" });
    }

    let finalLocation = event_mode === "Offline" ? location : "Virtual";

    let available_seats = null;

    if (event_mode === "Offline") {

      if (!total_seats || total_seats <= 0) {
        return res.status(400).json({ message: "Offline events must have total_seats > 0" });
      }

      available_seats = total_seats;

    }

    // ============================
    // GENERATE MEETING FOR ONLINE
    // ============================

    let meetingId = null;
    let meetingLink = null;

    if (event_mode === "Online") {

      meetingId = uuidv4().substring(0,8);

      meetingLink = `http://localhost:4200/webinar/${meetingId}`;

    }

    // Check duplicate event
    const [existing] = await db.query(
      `SELECT event_id FROM events WHERE event_name=?`,
      [event_name]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Event with this name already exists" });
    }

    // ============================
    // INSERT EVENT
    // ============================

    const [result] = await db.query(
      `INSERT INTO events 
      (event_name, event_description, event_date, timing, event_type, event_category, event_mode, location, total_seats, available_seats, meeting_id, meeting_link, ticket_price)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        event_name,
        event_description,
        event_date,
        timing,
        event_type,
        JSON.stringify(event_category),
        event_mode,
        finalLocation,
        total_seats || null,
        available_seats,
        meetingId,
        meetingLink,
        ticket_price
      ]
    );

    res.status(201).json({
      message: "wow eshika event add ho gaya",
      event_id: result.insertId,
      meeting_link: meetingLink
    });

  } 
  catch (err) {

    console.error("Error adding event:", err);
    res.status(500).json({ message: "Internal server error" });

  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`SELECT * FROM events WHERE event_id=?`, [id]);
    if (result.length === 0) return res.status(404).json({ message: "Event not found" });

    // Count users
    const [usersCount] = await db.query(
      `SELECT COUNT(*) AS total_users FROM event_registrations WHERE event_id=?`,
      [id]
    );

    res.json({ event: result[0], total_users: usersCount[0].total_users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching event" });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      event_name,
      event_description,
      event_date,
      timing,
      event_type,
      event_category = [],
      event_mode,
      location,
      total_seats,
       ticket_price
    } = req.body;

    const [existing] = await db.query(`SELECT * FROM events WHERE event_id=?`, [id]);
    if (!existing.length) return res.status(404).json({ message: "Event not found" });

    let finalLocation = event_mode === "Offline" ? location : "Virtual";

    let available_seats = existing[0].available_seats;

    if (event_mode === "Offline" && total_seats != null) {
      const bookedSeats = existing[0].total_seats - existing[0].available_seats;
      available_seats = total_seats - bookedSeats;
      if (available_seats < 0) available_seats = 0; // prevent negative seats
    }

    // Ensure event_category is always string for DB
    const categoryString = JSON.stringify(event_category || []);

    await db.query(
      `UPDATE events 
       SET event_name=?, event_description=?, event_date=?, timing=?, event_type=?, event_category=?, event_mode=?, location=?, total_seats=?, available_seats=?, ticket_price=?
       WHERE event_id=?`,
      [
        event_name,
        event_description,
        event_date,
        timing,
        event_type,
        categoryString,
        event_mode,
        finalLocation,
        total_seats || null,
        available_seats,
         ticket_price,
        id
      ]
    );

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("UPDATE EVENT ERROR:", err);
    res.status(500).json({ message: "Server error updating event", error: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM events WHERE event_id=?`, [id]);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting event" });
  }
};

// Book seats for offline event
exports.bookSeats = async (req, res) => {
  try {
    const { event_id, user_id, seats_to_book } = req.body;

    const [events] = await db.query(`SELECT * FROM events WHERE event_id=?`, [event_id]);
    if (events.length === 0) return res.status(404).json({ message: "Event not found" });

    const event = events[0];

    if (event.event_mode === "Offline") {
      if (event.available_seats < seats_to_book)
        return res.status(400).json({ message: "Not enough seats available" });

      await db.query(
        `UPDATE events SET available_seats = available_seats - ? WHERE event_id=?`,
        [seats_to_book, event_id]
      );
    }

    // Add attendee(s)
    for (let i = 0; i < seats_to_book; i++) {
      await db.query(
        `INSERT INTO event_registrations(event_id, user_id) VALUES(?, ?)`,
        [event_id, user_id]
      );
    }

    const [users] = await db.query(
      `SELECT a.id, a.name, a.email, a.phone FROM users a
       JOIN event_registrations ea ON a.id = ea.user_id
       WHERE ea.event_id=?`,
      [event_id]
    );

    res.json({
      message: "Booking successful",
      users,
      available_seats: event.available_seats - seats_to_book
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during booking" });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const { event_id, user_id, seats_to_book } = req.body;

    const [events] = await db.query(`SELECT * FROM events WHERE event_id=?`, [event_id]);
    if (events.length === 0) return res.status(404).json({ message: "Event not found" });

    const event = events[0];

    if (event.event_mode === "Offline") {
      if (event.available_seats < seats_to_book)
        return res.status(400).json({ message: "Not enough seats available" });

      // const amountPerSeat = 1000; // ₹1000 per ticket, you can change
      if (event.ticket_price <= 0) {
  return res.status(400).json({
    message: "This is a free event"
  });
}

const totalAmount =
  seats_to_book * Number(event.ticket_price) * 100;
      // const totalAmount = seats_to_book * amountPerSeat * 100; // in paise

      const options = {
        amount: totalAmount,
        currency: "INR",
        receipt: `receipt_event_${event_id}_att_${user_id}_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({ order });
    } else {
      return res.status(400).json({ message: "Payment not required for online events" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
};

// Verify payment webhook / callback
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      event_id,
      user_id,
      seats_to_book
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("BODY STRING:", razorpay_order_id + "|" + razorpay_payment_id);
console.log("EXPECTED:", expectedSignature);
console.log("RECEIVED:", razorpay_signature);
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment verified → reduce seats and register attendee
    const [events] = await db.query(`SELECT * FROM events WHERE event_id=?`, [event_id]);
    const event = events[0];

    await db.query(
      `UPDATE events SET available_seats = available_seats - ? WHERE event_id=?`,
      [seats_to_book, event_id]
    );

    // Add attendee(s)
    for (let i = 0; i < seats_to_book; i++) {
      await db.query(
        `INSERT INTO event_registrations(event_id, user_id) VALUES(?, ?)`,
        [event_id, user_id]
      );
    }

    res.json({ message: "Payment verified and seats booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};



exports.simulatePayment = async (req, res) => {

  try {

    console.log("===== PAYMENT SIMULATION STARTED =====");

    const { event_id, user_id, seats_to_book, amount } = req.body;

    console.log("Request Body:", req.body);

    // ===============================
    // 1️⃣ CREATE RAZORPAY ORDER
    // ===============================

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    const razorpay_order_id = order.id;

    console.log("Order Created:", razorpay_order_id);

    // ===============================
    // 2️⃣ SIMULATE PAYMENT ID
    // ===============================

    const razorpay_payment_id = "pay_" + Date.now();

    console.log("Simulated Payment ID:", razorpay_payment_id);

    // ===============================
    // 3️⃣ GENERATE SIGNATURE
    // ===============================

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpay_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Generated Signature:", razorpay_signature);

    // ===============================
    // 4️⃣ VERIFY SIGNATURE
    // ===============================

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);

    if (expectedSignature !== razorpay_signature) {

      console.log("Signature verification FAILED");

      return res.status(400).json({
        message: "Payment verification failed"
      });

    }

    console.log("Signature verified successfully");

    // ===============================
    // 5️⃣ FETCH EVENT
    // ===============================

    const [events] = await db.query(
      `SELECT * FROM events WHERE event_id=?`,
      [event_id]
    );

    console.log("Fetched Event:", events);

    if (events.length === 0) {

      console.log("Event not found");

      return res.status(404).json({
        message: "Event not found"
      });

    }

    const event = events[0];

    console.log("Available seats before booking:", event.available_seats);

    // ===============================
    // 6️⃣ CHECK SEAT AVAILABILITY
    // ===============================

    if (event.available_seats < seats_to_book) {

      console.log("Not enough seats available");

      return res.status(400).json({
        message: "Not enough seats available"
      });

    }

    // ===============================
    // 7️⃣ REDUCE SEATS
    // ===============================

    await db.query(
      `UPDATE events 
       SET available_seats = available_seats - ? 
       WHERE event_id=?`,
      [seats_to_book, event_id]
    );

    console.log("Seats reduced by:", seats_to_book);

    // ===============================
    // 8️⃣ REGISTER ATTENDEE
    // ===============================

    for (let i = 0; i < seats_to_book; i++) {

      console.log("Registering attendee:", user_id);

      await db.query(
        `INSERT INTO event_registrations(event_id, user_id) 
         VALUES(?, ?)`,
        [event_id, user_id]
      );

    }

    console.log("Attendee(s) registered successfully");

    // ===============================
    // 9️⃣ FINAL RESPONSE
    // ===============================

    res.json({

      message: "Payment simulated & seats booked successfully",

      order_id: razorpay_order_id,

      payment_id: razorpay_payment_id,

      signature: razorpay_signature

    });

    console.log("===== PAYMENT SIMULATION COMPLETED =====");

  }
  catch (err) {

    console.error("Payment simulation error:", err);

    res.status(500).json({
      error: "Payment simulation failed"
    });

  }

};

exports.getEventSummary = async (req,res)=>{

  try{

    const meetingId = req.params.meetingId

    console.log("Fetching summary for meeting:", meetingId)

    const [event] = await db.query(
      `SELECT summary, transcript 
       FROM events 
       WHERE meeting_id=?`,
      [meetingId]
    )

    console.log("DB RESULT:", event)

    if(event.length === 0){
      console.log("Event not found for meeting id:", meetingId)
      return res.status(404).json({message:"Event not found"})
    }

    console.log("Sending summary response")

    res.json(event[0])

  }
  catch(err){
    console.log("ERROR IN getEventSummary:",err)
    res.status(500).json({message:"Server error"})
  }
  const QRCode = require('qrcode');
app.get('/qr/:id', async (req, res) => {
  const url = `http://localhost:4200/checkin-form/${req.params.id}`;
  const qr = await QRCode.toDataURL(url);
  res.send(`<img src="${qr}" />`);
});


}