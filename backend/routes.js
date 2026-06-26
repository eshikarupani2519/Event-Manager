// routes.js:
const express=require("express")
const router=express.Router()
const authorize = require("./middleware/role.middleware");
const authController=require("./controllers/auth.controller")
const dashboardController=require("./controllers/dashboard.controller")
const eventController=require("./controllers/event.controller")
const attendeeController=require("./controllers/attendee.controller")
const authenticate=require("./middleware/auth.middleware");
const offlineEvenetController = require("./controllers/offlineEvenet.controller");
const db=require("./models/db");
const webinarController = require("./controllers/webinar.controller")
// dashboard stats
router.get("/dashboard",authenticate,dashboardController.getStats);

router.post("/save-recording",webinarController.saveRecording)

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
router.post("/registerAttendeeWebinar",authenticate,attendeeController.registerAttendeeWebinar);
router.get("/attendee",authenticate,attendeeController.getAttendeeByAttendeeId);
// router.get("/attendees/:id",authenticate,attendeeController.getAttendeeByEventId);

router.get("/attendees/:id",authenticate,attendeeController.getAttendeeByEventId);

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
router.post("/events/book", authenticate, eventController.bookSeats);


router.post("/payment/simulate", authenticate, eventController.simulatePayment);
router.get("/event-summary/:meetingId", eventController.getEventSummary);


router.get("/profile", (req, res) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, "secretKey"); 
        const attendeeId = decoded.id;

        const query = `
        SELECT 
            a.name,
            a.email,
            e.event_id,
            e.event_name,
            e.event_date,
            e.event_type
        FROM attendees a
        LEFT JOIN event_attendee ea ON a.id = ea.att_id
        LEFT JOIN events e ON ea.event_id = e.event_id
        WHERE a.id = ?
        `;

        db.query(query, [attendeeId], (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.json({ user: null, events: [] });
            }

            const user = {
                name: results[0].name,
                email: results[0].email
            };

            const events = results
                .filter(r => r.event_id !== null)
                .map(r => ({
                    event_id: r.event_id,
                    event_name: r.event_name,
                    event_date: r.event_date,
                    event_type: r.event_type
                }));

            res.json({
                user,
                events
            });

        });

    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }

});

module.exports = router;