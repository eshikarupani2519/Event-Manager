const jwt = require("jsonwebtoken");
const db = require("../models/db");
// import dotenv from "dotenv";
// dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS
//   }
// });
const { v4: uuidv4 } = require("uuid");
const transporter = require("../utils/mailer");

// // SIGNUP
// exports.signup = async (req, res) => {

//   try {

//     const { name, email, phone, password } = req.body;

//     if (!name || !email || !phone || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     // Check existing email
//     const [existing] = await db.query(
//       "SELECT id FROM attendees WHERE email=?",
//       [email]
//     );

//     if (existing.length > 0) {
//       return res.status(409).json({
//         message: "Email already registered"
//       });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const token = uuidv4();

//     // insert attendee
//     await db.query(
//       `INSERT INTO attendees
//       (name,email,phone,password,verification_token)
//       VALUES (?,?,?,?,?)`,
//       [name,email,phone,hashedPassword,token]
//     );

//     const verifyLink = `http://localhost:5000/api/auth/verify/${token}`;

//     // send email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Verify Your Account",
//       html: `
//         <h2>Welcome to Event Manager</h2>
//         <p>Click below to verify your account</p>
//         <a href="${verifyLink}">Verify Account</a>
//       `
//     });

//     res.json({
//       message: "Signup successful. Check email for verification link."
//     });

//   } catch (err) {

//     console.error(err);

//     res.status(500).json({
//       message: "Signup error"
//     });

//   }

// };
let user;
// exports.login = async (req, res) => {
//   const { username, password } = req.body; 
// console.log("RAW req.body:", req.body);
// console.log("Headers:", req.headers['content-type']);

//   try {
//     const result= await db.query("SELECT * FROM admin WHERE username = ?", [username]);
//     console.log(result)
//      user = result[0][0];

//     if (!user) return res.status(401).json({ message: "Invalid username" });

//    if (password !== user.password) {
//   return res.status(401).json({ message: "Invalid password" });
// }
// ;
   
//     const token = jwt.sign(
//   { id: user.id,role: user.role }, 
//   process.env.JWT_SECRET,
//   { expiresIn: '1d' }
// );


//    res.json({ 
//   token,
//   user: {
//     id: user.id,
//     name: user.name,
//     username: user.username,
   
//   }
// });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
 

// };

// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   try {

//     // 1️⃣ Check Admin Table
//     // const result= await db.query("SELECT * FROM admin WHERE username = ?", [username]);
//     const [adminResult] = await db.query(
//       "SELECT * FROM admin WHERE username = ?",
//       [username]
//     );

//     let user = adminResult[0];
//     let role = "admin";

//     // 2️⃣ If not admin, check Attendees table
//     if (!user) {
//       const [attendeeResult] = await db.query(
//         "SELECT * FROM attendees WHERE name = ?",
//         [username]   // frontend can send email in username field
//       );

//       user = attendeeResult[0];
//       console.log("user:",user)
//       role = "attendee";
//     }

//     // 3️⃣ If still no user
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // 4️⃣ Password check
//     if (password !== user.password) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // 5️⃣ Generate JWT
//     const token = jwt.sign(
//       { id: user.id, role: role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // 6️⃣ Send response
//     res.json({
//       token,
//       role,
//       user: {
//         id: user.id,
//         name: user.name,
//         username: user.username || user.email
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {

    // Check admin
    const [adminResult] = await db.query(
      "SELECT * FROM admin WHERE username = ?",
      [username]
    );

    let user = adminResult[0];
    let role = "admin";
    let table = "admin";

    // If not admin check attendees
    if (!user) {

      const [attendeeResult] = await db.query(
        "SELECT * FROM attendees WHERE name = ?",
        [username]
      );

      user = attendeeResult[0];
      role = "attendee";
      table = "attendees";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Save token in DB
    // if(role === "admin"){
    //     await db.query(
    //     "UPDATE admin SET verification_token=? WHERE username=?",
    //     [token, username]
    //     );
    // }else
      {
        await db.query(
        "UPDATE attendees SET verification_token=? WHERE id=?",
        [token, user.id]
        );
    }

    res.json({
      token,
      role,
      user: {
        id: user.id,
        name: user.name,
        username: user.username || user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyAccount = async (req, res) => {

  try {

    const token = req.params.token;

    const [user] = await db.query(
      "SELECT id FROM attendees WHERE verification_token=?",
      [token]
    );

    if (user.length === 0) {
      return res.send("Invalid verification link");
    }

    await db.query(
      `UPDATE attendees
       SET verified=TRUE,
           verification_token=NULL
       WHERE id=?`,
      [user[0].id]
    );

    res.send("Account verified successfully!");

  } catch (err) {

    console.error(err);

    res.status(500).send("Verification error");

  }

};

exports.signUp = async (req, res) => {

  try {

    console.log("Starting signup...");
    console.log(req.body);

    const { name, email, phone, city, state, country, password, interests } = req.body;

    if (!name || !email || !phone || !city || !state || !country || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // Check duplicate email
    const [existing] = await db.query(
      `SELECT id FROM attendees WHERE email=?`,
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // Insert new attendee
    const [result] = await db.query(
      `INSERT INTO attendees
      (name,email,phone,city,state,country,password,interests)
      VALUES (?,?,?,?,?,?,?,?)`,
      [name,email,phone,city,state,country,password,JSON.stringify(interests || [])]
    );

    res.status(201).json({
      message: "Signup successful",
      attendeeId: result.insertId
    });

  } catch (err) {

    console.error("Signup error:", err);

    res.status(500).json({
      message: "Server error during signup"
    });

  }

};