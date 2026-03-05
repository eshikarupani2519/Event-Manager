const db = require("../models/db");
exports.registerAttendee=async (req,res)=>{
    
        try{
            console.log("Starting attendee add...");
        console.log("Received files:", req.files);
        console.log("Received body:", req.body);
        
        // Extract data from the request body
        const {
          name,phone,email,event
        } = req.body;
    
       
        
        // Check if the attendee already exists
        const attendeeCheckResult = await db.query(
          `SELECT att_id FROM attendees WHERE att_name LIKE ?`,
          [name]
        );
        console.log(attendeeCheckResult)
        if (attendeeCheckResult[0].length > 0) {
         
          res.status(409).json("duplicate user");
        } else {
          console.log("inserting new attendee.");
          const attendeeInsertResult = await db.query(
            `INSERT INTO attendees (att_name,att_email,att_phone ) VALUES (?, ?, ?) `,
            [name,email,phone]
          );
          console.log("attendeeInsertResult:",attendeeInsertResult)
          const attId = attendeeInsertResult[0].insertId;
          const eventResult=await db.query(`SELECT events.event_id from events where events.event_name='${event}'`);
          console.log("eventResult:",eventResult)
          const ev_id=eventResult[0][0].event_id;
          const attendeeResult=await db.query(
            `INSERT INTO event_attendee VALUES (${ev_id},${attId})`
          )
          console.log("New attendee inserted ",attendeeInsertResult[0]);
          res.status(201).json(attendeeInsertResult[0]);
        }
     
        
    
        }
        catch(err){
       
        console.error("Error during event registration:", err);
        res.status(500).json({ message: "Internal Server Error during attendee registration." });
        }
        
}

exports.getAttendeeByEventId=async (req,res)=>{
    const { id } = req.params;
    
      try {
        const result = await db.query(`
         SELECT e.event_name FROM events as e WHERE e.event_id = ?
        `, [id]);
        const event = result[0];
        if (!event) {
          return res.status(404).json({ error: 'event not found' });
        }
        const attendeesResult=await db.query(`SELECT att.att_name,att.att_email,att.att_phone FROM attendees as att JOIN event_attendee as ea ON att.att_id=ea.att_id WHERE ea.event_id=?`,[id])
        console.log("attendeesResult:",attendeesResult)
        res.json(attendeesResult);
      } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ error: 'Server error' });
      }
}