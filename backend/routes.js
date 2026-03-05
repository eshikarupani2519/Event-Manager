const express=require("express")
const router=express.Router()
const authorize = require("./middleware/role.middleware");
const authController=require("./controllers/auth.controller")
const dashboardController=require("./controllers/dashboard.controller")
const eventController=require("./controllers/event.controller")
const attendeeController=require("./controllers/attendee.controller")
const authenticate=require("./middleware/auth.middleware")

// dashboard stats
router.get("/dashboard",authenticate,authorize("admin"),dashboardController.getStats);

// login
router.post("/login", authController.login);

// events
router.get("/events",authenticate,authorize("admin"),eventController.getAllEvents);

router.post("/events",authenticate,authorize("admin"),eventController.addEvent);

router.put("/event/:id",authenticate,authorize("admin"),eventController.updateEvent);

router.delete("/event/:id",authenticate,authorize("admin"),eventController.deleteEvent);

router.get("/event/:id",authenticate,authorize("admin"),eventController.getEventById);

// attendees

router.post("/attendees",authenticate,authorize("admin"),attendeeController.registerAttendee);

router.get("/attendees/:id",authenticate,authorize("admin"),attendeeController.getAttendeeByEventId);

module.exports = router;