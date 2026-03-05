// require("dotenv").config()
require("dotenv").config({ path: "../.env" })
const nodemailer = require("nodemailer")
console.log("EMAIL:", process.env.EMAIL)
console.log("PASS:", process.env.EMAIL_PASS)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

async function testMail(){
    try{

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: "anshusachdev22@gmail.com",   // put your email here
            subject: "Test Email From Webinar System",
            text: "If you receive this, nodemailer is working!"
        })

        console.log("Email sent successfully")

    }catch(err){
        console.log("Email error:",err)
    }
}

testMail()