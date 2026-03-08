// event.controller.js:
// const db = require("../models/db")
// exports.getAllEvents = async (req, res) => {
//     try {

//         const query = `
//       SELECT * from events;
//     `;
//         const result = await db.query(query);
     
//       return  res.json(result[0]);
//     }
//     catch (err) {
//         console.error(err);
//       return  res.status(500).json({ message: 'Error fetching events' });
//     }
// }

// exports.addEvent=async (req,res)=>{
   
//     try{
//         console.log("Starting event add...");
//     console.log("Received files:", req.files);
//     console.log("Received body:", req.body);
    
//     // Extract data from the request body
//     const {
//       event_name,event_description,event_date,event_type,timing
//     } = req.body;

 
    
   
    
//     // Check if the event already exists
//     const eventCheckResult = await db.query(
//       `SELECT event_id FROM events WHERE event_name LIKE ?`,
//       [event_name]
//     );
  

//     if (eventCheckResult[0].length > 0) {
//      return res.status(409).json({ error: 'Event already exists!' });
      
//     } else {

//       const eventInsertResult = await db.query(
//         `INSERT INTO events (event_name,event_description,event_date,timing,event_type ) VALUES (?, ?, ?, ?, ?) `,
//         [event_name,event_description,event_date,timing,event_type]
//       );

//       console.log("New event inserted ",eventInsertResult);
//     }
    
 
//     console.log("event inserted ")
//     return res.status(201).json("wowwww,areyyy eshika kya daali h tu ye wowww, wow kya hota h");

//     }
//     catch(err){

//     console.error("Error during event registration:", err);
//    return res.status(500).json({ message: "Internal Server Error during event registration." });
//     }

// }

// exports.getEventById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await db.query(`
//      SELECT e.event_name,e.event_description,e.event_date,e.timing,e.event_type FROM events as e WHERE e.event_id = ?
//     `, [id]);
//     const event = result[0][0];
//     if (!event) {
//       return res.status(404).json({ error: 'event not found' });
//     }
//     const totalAttendeesResult=await db.query(`SELECT COUNT(*) FROM event_attendee WHERE event_attendee.event_id=?`,[id])
//     const totalAttendees= totalAttendeesResult[0];
//     res.json({event,totalAttendees});
//   } catch (error) {
//     console.error('Error fetching event by ID:', error);
//    return res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.updateEvent = async (req, res) => {

  
//   try {
//     const { id } = req.params;
//     const {
//       event_name,event_description,event_date,timing,event_type
//     } = req.body;
    

//     const eventResult = await db.query('SELECT event_id FROM events WHERE events.event_id = ?', [id]);
//     if (eventResult.length === 0) {
//       return res.status(404).json({ message: 'event not found' });
//     }
      
//       const updateResult=await db.query(`UPDATE events SET event_name=?,event_description=?,event_date=?,timing=?,event_type=? WHERE event_id = ?`,[event_name,event_description,event_date,timing,event_type,id]);
//     console.log("updated event")


    
//     res.status(200).json({ message: 'event updated successfully' });
//   } catch (err) {

//     console.error(err);
//     res.status(500).json({ message: 'Failed to update event' });
//   } 
// };

// exports.deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await db.query(`DELETE FROM events WHERE event_id = ?`, [id]);
//     res.json({ message: 'event deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error deleting event' });
//   }
// };

// exports.joinWebinar = (req,res)=>{

//     const meetingId = req.params.meetingId

//     const query = `
//     SELECT * FROM events
//     WHERE meeting_id = ?
//     `

//     db.query(query,[meetingId],(err,result)=>{

//         if(err) throw err

//         if(result.length === 0){

//             return res.status(404).json({
//                 message:"Invalid meeting link"
//             })

//         }

//         if(result[0].webinar_status !== "live"){

//             return res.json({
//                 message:"Webinar has not started yet"
//             })

//         }

//         res.json({
//             meetingId,
//             event:result[0]
//         })

//     })

// }
// exports.registerForEvent = async (req,res)=>{

//   try{

//     const {attendee_id,event_id} = req.body

//     await db.query(
//       `INSERT INTO event_attendee(event_id,att_id)
//        VALUES (?,?)`,
//       [event_id,attendee_id]
//     )

//     res.json({
//       message:"Successfully registered for event"
//     })

//   }
//   catch(err){

//     console.log(err)

//     res.status(500).json({
//       message:"Event registration failed"
//     })

//   }

// }

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

// Add new event
// exports.addEvent = async (req, res) => {
//   try {
//     const {
//       event_name,
//       event_description,
//       event_date,
//       timing,
//       event_type,
//       event_category = [],
//       event_mode,
//       location,
//       total_seats
//     } = req.body;

//     // Validate online/offline & seats
//     if (!["Online", "Offline"].includes(event_mode)) {
//       return res.status(400).json({ message: "event_mode must be Online or Offline" });
//     }
//     let finalLocation = event_mode === "Offline" ? location : "Virtual";

//     let available_seats = null;
//     if (event_mode === "Offline") {
//       if (!total_seats || total_seats <= 0) {
//         return res.status(400).json({ message: "Offline events must have total_seats > 0" });
//       }
//       available_seats = total_seats;
//     }

//     // Check duplicate event
//     const [existing] = await db.query(
//       `SELECT event_id FROM events WHERE event_name=?`,
//       [event_name]
//     );
//     if (existing.length > 0) {
//       return res.status(409).json({ message: "Event with this name already exists" });
//     }

//     // Insert event
//     const [result] = await db.query(
//       `INSERT INTO events 
//       (event_name, event_description, event_date, timing, event_type, event_category, event_mode, location, total_seats, available_seats)
//       VALUES (?,?,?,?,?,?,?,?,?,?)`,
//       [
//         event_name,
//         event_description,
//         event_date,
//         timing,
//         event_type,
//         JSON.stringify(event_category),
//         event_mode,
//         finalLocation,
//         total_seats || null,
//         available_seats
//       ]
//     );

//     res.status(201).json({ message: "wow eshika event add ho gaya", event_id: result.insertId });
//   } catch (err) {
//     console.error("Error adding event:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const { v4: uuidv4 } = require("uuid")

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
      total_seats
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
      (event_name, event_description, event_date, timing, event_type, event_category, event_mode, location, total_seats, available_seats, meeting_id, meeting_link)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
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
        meetingLink
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

    // Count attendees
    const [attendeesCount] = await db.query(
      `SELECT COUNT(*) AS total_attendees FROM event_attendee WHERE event_id=?`,
      [id]
    );

    res.json({ event: result[0], total_attendees: attendeesCount[0].total_attendees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching event" });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      event_name,
      event_description,
      event_date,
      timing,
      event_type,
      event_category,
      event_mode,
      location,
      total_seats
    } = req.body;

    const [existing] = await db.query(`SELECT * FROM events WHERE event_id=?`, [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Event not found" });

    let finalLocation = event_mode === "Offline" ? location : "Virtual";
    let available_seats = existing[0].available_seats;
    if (event_mode === "Offline" && total_seats) {
      // Adjust available seats proportionally
      const bookedSeats = existing[0].total_seats - existing[0].available_seats;
      available_seats = total_seats - bookedSeats;
    }

    await db.query(
      `UPDATE events SET event_name=?, event_description=?, event_date=?, timing=?, event_type=?, event_category=?, event_mode=?, location=?, total_seats=?, available_seats=? WHERE event_id=?`,
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
        id
      ]
    );

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating event" });
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
    const { event_id, attendee_id, seats_to_book } = req.body;

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
        `INSERT INTO event_attendee(event_id, att_id) VALUES(?, ?)`,
        [event_id, attendee_id]
      );
    }

    const [attendees] = await db.query(
      `SELECT a.id, a.name, a.email, a.phone FROM attendees a
       JOIN event_attendee ea ON a.id = ea.att_id
       WHERE ea.event_id=?`,
      [event_id]
    );

    res.json({
      message: "Booking successful",
      attendees,
      available_seats: event.available_seats - seats_to_book
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during booking" });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const { event_id, attendee_id, seats_to_book } = req.body;

    const [events] = await db.query(`SELECT * FROM events WHERE event_id=?`, [event_id]);
    if (events.length === 0) return res.status(404).json({ message: "Event not found" });

    const event = events[0];

    if (event.event_mode === "Offline") {
      if (event.available_seats < seats_to_book)
        return res.status(400).json({ message: "Not enough seats available" });

      const amountPerSeat = 1000; // ₹1000 per ticket, you can change
      const totalAmount = seats_to_book * amountPerSeat * 100; // in paise

      const options = {
        amount: totalAmount,
        currency: "INR",
        receipt: `receipt_event_${event_id}_att_${attendee_id}_${Date.now()}`,
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
      attendee_id,
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
        `INSERT INTO event_attendee(event_id, att_id) VALUES(?, ?)`,
        [event_id, attendee_id]
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
    const { event_id, attendee_id, seats_to_book, amount } = req.body;

    // 1️⃣ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    const razorpay_order_id = order.id;

    // 2️⃣ Simulate Razorpay payment_id
    const razorpay_payment_id = "pay_" + Date.now();

    // 3️⃣ Generate signature exactly like Razorpay
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpay_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // 4️⃣ Verify signature (same logic as real payment verification)
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 5️⃣ Booking logic (your DB logic here)
    // Example:
    /*
    await Booking.create({
      event_id,
      attendee_id,
      seats_booked: seats_to_book,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });
    */

    res.json({
      message: "Payment simulated & verified successfully",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment simulation failed" });
  }
};

exports.getEventSummary = async (req,res)=>{

  try{

    const meetingId = req.params.meetingId

    const [event] = await db.query(
      `SELECT summary, transcript 
       FROM events 
       WHERE meeting_id=?`,
      [meetingId]
    )

    if(event.length === 0){
      return res.status(404).json({message:"Event not found"})
    }

    res.json(event[0])

  }
  catch(err){
    console.log(err)
    res.status(500).json({message:"Server error"})
  }

}