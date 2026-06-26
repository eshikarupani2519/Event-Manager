const db = require("../models/db");
// import db from "../models/db.js";
// const nodemailer = require("nodemailer");
// import dotenv from "dotenv";
// dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS
//   }
// });
// REGISTER ATTENDEE
exports.registerAttendee = async (req, res) => {
  try {
    console.log("Starting attendee add...");
    console.log("Received body:", req.body);
    const event_id=request.body.event_id;

    const { name, email, phone, city, state, country, password, interests } = req.body;

    if (!name || !phone || !email || !city || !state || !country || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate using email
    const [existing] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Attendee already registered" });
    }

    console.log("Inserting new attendee...");

    // Insert attendee
    const [insertResult] = await db.query(
      `INSERT INTO users (name, email, phone, city, state, country, password, interests) VALUES (?,?,?,?,?,?,?,?)`,
      [name, email, phone, city, state, country, password, interests]
    );

    const attId = insertResult.insertId;

    // Get event id safely
    const [eventResult] = await db.query(
      `SELECT event_id FROM events WHERE event_name = ?`,
      [event_id]
    );

    if (eventResult.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ev_id = eventResult[0].event_id;

    // Insert into mapping table
    await db.query(
      `INSERT INTO event_registrations (event_id, user_id) VALUES (?,?)`,
      [ev_id, attId]
    );

    console.log("New attendee inserted:", insertResult);

    res.status(201).json({
      message: "Attendee registered successfully",
      attendeeId: attId
    });

  } catch (err) {
    console.error("Error during event registration:", err);
    res.status(500).json({
      message: "Internal Server Error during attendee registration."
    });
  }
};


// GET users BY EVENT ID
exports.getAttendeeByEventId = async (req, res) => {
  const { id } = req.params;

  try {

    // Check event
    const [event] = await db.query(
      `SELECT event_name FROM events WHERE event_id = ?`,
      [id]
    );

    if (event.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Fetch users
    const [users] = await db.query(
      `SELECT 
        a.id,
        a.name,
        a.email,
        a.phone
       FROM users a
       JOIN event_registrations ea ON a.id = ea.user_id
       WHERE ea.event_id = ?`,
      [id]
    );

    res.json({
      event: event[0].event_name,
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.getAttendeeByAttendeeId = async (req, res) => {
//    const userId = req.user.userIdd;
//    console.log("requested user with id:",userId);

//   try {
//     const [attendee] = await db.query(
//       `SELECT * FROM users WHERE id = ?`,
//       [userId]
//     );

//     if (attendee.length === 0) {
//       return res.status(404).json({ error: "Attendee not found" });
//     }
//     res.json({
//       attendee
//     });

//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getAttendeeByAttendeeId = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const userId = req.user.userId;

    console.log("requested user with id:", userId);

    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    console.log("DB rows:", rows);

    if (!rows.length) {
      return res.status(404).json({
        error: "Attendee not found"
      });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      error: error.message
    });
  }
};

exports.registerAttendeeWebinar = async (req, res) => {
  try {

    const { name, email, phone, event } = req.body;

    if (!name || !email || !phone || !event) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if attendee already exists
    const [existing] = await db.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    let attId;

    if (existing.length > 0) {
      attId = existing[0].id;
    } else {

      // Insert new attendee
      const [insertResult] = await db.query(
        `INSERT INTO users (name, email, phone) VALUES (?,?,?)`,
        [name, email, phone]
      );

      attId = insertResult.insertId;
    }

    // Get event id
    const [eventResult] = await db.query(
      `SELECT event_id FROM events WHERE event_name = ?`,
      [event]
    );

    if (eventResult.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const eventId = eventResult[0].event_id;

    // Check if already registered
    const [existingMap] = await db.query(
      `SELECT * FROM event_registrations WHERE event_id=? AND user_id=?`,
      [eventId, attId]
    );

    if (existingMap.length > 0) {
      return res.status(409).json({ message: "Already registered for this event" });
    }

    // Map attendee to event
    await db.query(
      `INSERT INTO event_registrations (event_id, user_id) VALUES (?,?)`,
      [eventId, attId]
    );

    res.status(201).json({
      message: "Successfully registered for event"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};