const db = require("../models/db")

exports.saveRecording = async (req,res)=>{

    try{

        const {eventId, recordingUrl} = req.body

        await db.query(
            `UPDATE events SET recording_url=? WHERE event_id=?`,
            [recordingUrl,eventId]
        )

        res.json({message:"Recording saved"})
    }
    catch(err){
        console.log(err)
        res.status(500).send("Error")
    }

}