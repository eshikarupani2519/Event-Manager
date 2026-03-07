const db = require("../models/db")
exports.getAllEvents = async (req, res) => {
    try {

        const query = `
      SELECT * from events;
    `;
        const result = await db.query(query);
     
      return  res.json(result[0]);
    }
    catch (err) {
        console.error(err);
      return  res.status(500).json({ message: 'Error fetching events' });
    }
}

exports.addEvent=async (req,res)=>{
   
    try{
        console.log("Starting event add...");
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);
    
    // Extract data from the request body
    const {
      event_name,event_description,event_date,event_type,timing
    } = req.body;

 
    
   
    
    // Check if the event already exists
    const eventCheckResult = await db.query(
      `SELECT event_id FROM events WHERE event_name LIKE ?`,
      [event_name]
    );
  

    if (eventCheckResult[0].length > 0) {
     return res.status(409).json({ error: 'Event already exists!' });
      
    } else {

      const eventInsertResult = await db.query(
        `INSERT INTO events (event_name,event_description,event_date,timing,event_type ) VALUES (?, ?, ?, ?, ?) `,
        [event_name,event_description,event_date,timing,event_type]
      );

      console.log("New event inserted ",eventInsertResult);
    }
    
 
    console.log("event inserted ")
    return res.status(201).json("wowwww,areyyy eshika kya daali h tu ye wowww, wow kya hota h");

    }
    catch(err){

    console.error("Error during event registration:", err);
   return res.status(500).json({ message: "Internal Server Error during event registration." });
    }

}

exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
     SELECT e.event_name,e.event_description,e.event_date,e.timing,e.event_type FROM events as e WHERE e.event_id = ?
    `, [id]);
    const event = result[0][0];
    if (!event) {
      return res.status(404).json({ error: 'event not found' });
    }
    const totalAttendeesResult=await db.query(`SELECT COUNT(*) FROM event_attendee WHERE event_attendee.event_id=?`,[id])
    const totalAttendees= totalAttendeesResult[0];
    res.json({event,totalAttendees});
  } catch (error) {
    console.error('Error fetching event by ID:', error);
   return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {

  
  try {
    const { id } = req.params;
    const {
      event_name,event_description,event_date,timing,event_type
    } = req.body;
    

    const eventResult = await db.query('SELECT event_id FROM events WHERE events.event_id = ?', [id]);
    if (eventResult.length === 0) {
      return res.status(404).json({ message: 'event not found' });
    }
      
      const updateResult=await db.query(`UPDATE events SET event_name=?,event_description=?,event_date=?,timing=?,event_type=? WHERE event_id = ?`,[event_name,event_description,event_date,timing,event_type,id]);
    console.log("updated event")


    
    res.status(200).json({ message: 'event updated successfully' });
  } catch (err) {

    console.error(err);
    res.status(500).json({ message: 'Failed to update event' });
  } 
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM events WHERE event_id = ?`, [id]);
    res.json({ message: 'event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

exports.joinWebinar = (req,res)=>{

    const meetingId = req.params.meetingId

    const query = `
    SELECT * FROM events
    WHERE meeting_id = ?
    `

    db.query(query,[meetingId],(err,result)=>{

        if(err) throw err

        if(result.length === 0){

            return res.status(404).json({
                message:"Invalid meeting link"
            })

        }

        if(result[0].webinar_status !== "live"){

            return res.json({
                message:"Webinar has not started yet"
            })

        }

        res.json({
            meetingId,
            event:result[0]
        })

    })

}
exports.registerForEvent = async (req,res)=>{

  try{

    const {attendee_id,event_id} = req.body

    await db.query(
      `INSERT INTO event_attendee(event_id,att_id)
       VALUES (?,?)`,
      [event_id,attendee_id]
    )

    res.json({
      message:"Successfully registered for event"
    })

  }
  catch(err){

    console.log(err)

    res.status(500).json({
      message:"Event registration failed"
    })

  }

}