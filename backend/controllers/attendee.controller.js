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

    const { name, email, phone, city, state, country, password, interests } = req.body;

    if (!name || !phone || !email || !city || !state || !country || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate using email
    const [existing] = await db.query(
      `SELECT id FROM attendees WHERE email = ?`,
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Attendee already registered" });
    }

    console.log("Inserting new attendee...");

    // Insert attendee
    const [insertResult] = await db.query(
      `INSERT INTO attendees (name, email, phone, city, state, country, password, interests) VALUES (?,?,?,?,?,?,?,?)`,
      [name, email, phone]
    );

    const attId = insertResult.insertId;

    // Get event id safely
    const [eventResult] = await db.query(
      `SELECT event_id FROM events WHERE event_name = ?`,
      [event]
    );

    if (eventResult.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ev_id = eventResult[0].event_id;

    // Insert into mapping table
    await db.query(
      `INSERT INTO event_attendee (event_id, att_id) VALUES (?,?)`,
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


// GET ATTENDEES BY EVENT ID
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

    // Fetch attendees
    const [attendees] = await db.query(
      `SELECT 
        a.id,
        a.name,
        a.email,
        a.phone
       FROM attendees a
       JOIN event_attendee ea ON a.id = ea.att_id
       WHERE ea.event_id = ?`,
      [id]
    );

    res.json({
      event: event[0].event_name,
      attendees
    });

  } catch (error) {
    console.error("Error fetching attendees:", error);
    res.status(500).json({ error: "Server error" });
  }
};