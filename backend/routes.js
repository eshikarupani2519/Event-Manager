const express=require("express")
const router=express.Router()
const authorize = require("./middleware/role.middleware");
const authController=require("./controllers/auth.controller")
const dashboardController=require("./controllers/dashboard.controller")
const eventController=require("./controllers/event.controller")
const attendeeController=require("./controllers/attendee.controller")
const authenticate=require("./middleware/auth.middleware")

// dashboard stats
router.get("/dashboard",authenticate,dashboardController.getStats);


router.post("/signup", authController.signUp);

router.get("/verify/:token", authController.verifyAccount);

// login
router.post("/login", authController.login);

// events
router.get("/events",authenticate,eventController.getAllEvents);

router.post("/events",authenticate,eventController.addEvent);

router.put("/event/:id",authenticate,eventController.updateEvent);

router.delete("/event/:id",authenticate,eventController.deleteEvent);

router.get("/event/:id",authenticate,eventController.getEventById);

// attendees

router.post("/attendees",authenticate,attendeeController.registerAttendee);

router.get("/attendees/:id",authenticate,attendeeController.getAttendeeByEventId);
router.get("/attendee",authenticate,attendeeController.getAttendeeByAttendeeId);
// router.get("/webinar/:meetingId",eventController.joinWebinar);

router.get("/:meetingId", async(req,res)=>{

    try{

        const {meetingId} = req.params

        const [event] = await db.query(`
        SELECT * FROM events
        WHERE meeting_id=?
        `,[meetingId])

        if(event.length === 0){

            return res.status(404).json({
                message:"Webinar not found"
            })

        }

        res.json(event[0])

    }
    catch(err){

        console.log(err)

        res.status(500).json({
            message:"Server error"
        })

    }

})


// ==========================
// ADMIN START WEBINAR
// ==========================

router.post("/start/:meetingId", async(req,res)=>{

    try{

        const {meetingId} = req.params

        await db.query(`
        UPDATE events
        SET webinar_status='live'
        WHERE meeting_id=?
        `,[meetingId])

        res.json({
            message:"Webinar started successfully"
        })

    }
    catch(err){

        console.log(err)

        res.status(500).json({
            message:"Server error"
        })

    }

})


// ==========================
// END WEBINAR
// ==========================

router.post("/end/:meetingId", async(req,res)=>{

    try{

        const {meetingId} = req.params

        await db.query(`
        UPDATE events
        SET webinar_status='ended'
        WHERE meeting_id=?
        `,[meetingId])

        res.json({
            message:"Webinar ended successfully"
        })

    }
    catch(err){

        console.log(err)

        res.status(500).json({
            message:"Server error"
        })

    }

})


router.post("/join", async(req,res)=>{

    try{

        const {meetingId,email} = req.body

        const [event] = await db.query(`
        SELECT * FROM events
        WHERE meeting_id=?
        `,[meetingId])

        if(event.length === 0){

            return res.status(404).json({
                message:"Invalid meeting link"
            })

        }

        if(event[0].webinar_status === "ended"){

            return res.status(400).json({
                message:"Webinar already ended"
            })

        }

        const [attendee] = await db.query(`
        SELECT * FROM attendees
        WHERE email=?
        `,[email])

        if(attendee.length === 0){

            return res.status(404).json({
                message:"Attendee not registered"
            })

        }

        res.json({
            message:"Join allowed",
            webinar:event[0],
            user:attendee[0]
        })

    }
    catch(err){

        console.log(err)

        res.status(500).json({
            message:"Server error"
        })

    }

})

module.exports = router;