const db = require("../models/db"); // your mysql pool

module.exports = {
  getAllEvents: async (req, res) => {
    try {
      const [events] = await db.query(`SELECT * FROM events WHERE activeYN=1`);
      res.json(events);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  addEvent: async (req, res) => {
    try {
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

      let available_seats = null;
      if (event_mode === "Offline") {
        available_seats = total_seats; // initialize available seats
      }

      const [result] = await db.query(
        `INSERT INTO events 
        (event_name,event_description,event_date,timing,event_type,event_category,event_mode,location,total_seats,available_seats)
        VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [
          event_name,
          event_description,
          event_date,
          timing,
          event_type,
          JSON.stringify(event_category),
          event_mode,
          location,
          total_seats,
          available_seats
        ]
      );

      res.json({ message: "Event added", event_id: result.insertId });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  bookSeats: async (req, res) => {
    try {
      const { event_id, attendee_id, seats_to_book } = req.body;

      // Get event
      const [events] = await db.query(`SELECT * FROM events WHERE event_id=?`, [event_id]);
      if (events.length === 0) return res.status(404).json({ message: "Event not found" });

      const event = events[0];
      if (event.event_mode === "Offline") {
        if (event.available_seats < seats_to_book)
          return res.status(400).json({ message: "Not enough seats available" });

        // Update available seats
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

      // Return updated attendee info
      const [attendees] = await db.query(
        `SELECT a.id, a.name, a.email, a.phone FROM attendees a
         JOIN event_attendee ea ON a.id = ea.att_id
         WHERE ea.event_id=?`,
        [event_id]
      );

      res.json({ message: "Booking successful", attendees, available_seats: event.available_seats - seats_to_book });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
};