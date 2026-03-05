const cron = require("node-cron")
const db = require("../models/db")
const moment = require("moment")
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")

// EMAIL CONFIG
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

// GENERATE MEETING ID
function generateMeetingId(){
    return uuidv4().substring(0,8)
}

// SEND EMAIL
async function sendEmail(to,subject,text){
    await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject,
        text
    })
}

// CRON JOB
cron.schedule("* * * * *", async () => {

    try{

        const query = `
        SELECT e.*,a.email,a.id as attendee_id
        FROM events e
        JOIN event_attendee ea ON e.event_id = ea.event_id
        JOIN attendees a ON ea.att_id = a.id
        WHERE e.event_mode='Online'
        AND e.activeYN=1
        `

        const [events] = await db.query(query)

        const now = moment()

        for(const event of events){

            // const eventTime = moment(event.event_date + " " + event.timing)
            const eventTime = moment(event.event_date).format("YYYY-MM-DD") + " " + event.timing
const eventMoment = moment(eventTime, "YYYY-MM-DD HH:mm:ss")
            // const diffMinutes = eventTime.diff(now,"minutes")
            const now = moment()
const diffMinutes = eventMoment.diff(now, "minutes")
console.log("Event:", event.event_name)
console.log("Event time:", eventMoment.format())
console.log("Now:", now.format())
console.log("Diff minutes:", diffMinutes)

            // ============================
            // GENERATE MEETING LINK + SEND EMAIL
            // ============================

            if(!event.meeting_id){

                console.log("Generating meeting for:",event.event_name)

                const meetingId = generateMeetingId()
                const meetingLink = `http://localhost:4200/webinar/${meetingId}`

                await db.query(`
                    UPDATE events
                    SET meeting_id=?, meeting_link=?
                    WHERE event_id=?
                `,[meetingId,meetingLink,event.event_id])

                event.meeting_id = meetingId
                event.meeting_link = meetingLink

                const msg = `
Hello,

Your webinar "${event.event_name}" has been scheduled.

Meeting ID: ${meetingId}
Join Link: ${meetingLink}

Date: ${event.event_date}
Time: ${event.timing}

See you there!
                `

                await sendEmail(
                    event.email,
                    "Webinar Scheduled - Join Link",
                    msg
                )

                console.log("Initial webinar email sent to:",event.email)
            }

            // ============================
            // 1 DAY REMINDER
            // ============================
// yaha 1440 daalna hai baadmein 
            if(diffMinutes === 1440){

                const [check] = await db.query(`
                    SELECT * FROM notifications
                    WHERE attendee_id=? AND event_id=? AND reminder_type='1_DAY'
                `,[event.attendee_id,event.event_id])

                if(check.length === 0){

                    const msg = `
Hello,

Reminder: Webinar "${event.event_name}" is tomorrow.

Meeting ID: ${event.meeting_id}
Join Link: ${event.meeting_link}
                    `
console.log("EMAIL:", process.env.EMAIL)
console.log("PASS:", process.env.EMAIL_PASS)
                    await sendEmail(
                        event.email,
                        "Webinar Reminder (Tomorrow)",
                        msg
                    )

                    await db.query(`
                        INSERT INTO notifications(attendee_id,event_id,reminder_type)
                        VALUES(?,?, '1_DAY')
                    `,[event.attendee_id,event.event_id])

                    console.log("1 day reminder sent:",event.email)
                }
            }

            // ============================
            // 30 MIN REMINDER
            // ============================

            if(diffMinutes === 30){

                const [check] = await db.query(`
                    SELECT * FROM notifications
                    WHERE attendee_id=? AND event_id=? AND reminder_type='30_MIN'
                `,[event.attendee_id,event.event_id])

                if(check.length === 0){

                    const msg = `
Hello,

Your webinar "${event.event_name}" will start in 30 minutes.

Meeting ID: ${event.meeting_id}
Join Link: ${event.meeting_link}
                    `

                    await sendEmail(
                        event.email,
                        "Webinar Starting Soon",
                        msg
                    )

                    await db.query(`
                        INSERT INTO notifications(attendee_id,event_id,reminder_type)
                        VALUES(?,?,'30_MIN')
                    `,[event.attendee_id,event.event_id])

                    console.log("30 min reminder sent:",event.email)
                }
            }

            // ============================
            // START WEBINAR
            // ============================

            if(diffMinutes === 0 && event.webinar_status === "scheduled"){

                await db.query(`
                    UPDATE events
                    SET webinar_status='live'
                    WHERE event_id=?
                `,[event.event_id])

                console.log("Webinar Started:",event.event_name)
            }

            // ============================
            // END WEBINAR
            // ============================

            if(diffMinutes === -120 && event.webinar_status === "live"){

                await db.query(`
                    UPDATE events
                    SET webinar_status='ended'
                    WHERE event_id=?
                `,[event.event_id])

                console.log("Webinar Ended:",event.event_name)
            }

        }

    }
    catch(err){
        console.log("Scheduler error:",err)
    }

})

console.log("Webinar Scheduler Running")