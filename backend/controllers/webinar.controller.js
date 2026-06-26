// const db = require("../models/db")

// exports.saveRecording = async (req,res)=>{

//     try{

//         const {eventId, recordingUrl} = req.body

//         await db.query(
//             `UPDATE events SET recording_url=? WHERE event_id=?`,
//             [recordingUrl,eventId]
//         )

//         res.json({message:"Recording saved"})
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).send("Error")
//     }

// }



const db = require("../models/db");

exports.saveRecording = async (req, res) => {
  try {

    const { eventId, recordingUrl } = req.body;

    if (!eventId || !recordingUrl) {
      return res.status(400).json({
        message: "eventId and recordingUrl are required"
      });
    }

    const [result] = await db.query(
      `UPDATE events
       SET recording_url = ?
       WHERE event_id = ?`,
      [recordingUrl, eventId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json({
      message: "Recording saved successfully"
    });

  } catch (err) {

    console.error("SAVE RECORDING ERROR:", err);

    res.status(500).json({
      message: "Internal server error"
    });

  }
};