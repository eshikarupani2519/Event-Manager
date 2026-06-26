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

let user;
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

    // If not admin check users
    if (!user) {

      const [attendeeResult] = await db.query(
        "SELECT * FROM users WHERE name = ?",
        [username]
      );

      user = attendeeResult[0];
      role = "attendee";
      table = "users";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: role },
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
        "UPDATE users SET verification_token=? WHERE id=?",
        [token,  user.id]
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
      "SELECT id FROM users WHERE verification_token=?",
      [token]
    );

    if (user.length === 0) {
      return res.send("Invalid verification link");
    }

    await db.query(
      `UPDATE users
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

    const { name, email, phone, city, state, country, password, interests} = req.body;

    if (!name || !email || !phone || !city || !state || !country || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    // Check duplicate email
    const [existing] = await db.query(
      `SELECT id FROM users WHERE email=?`,
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // Insert new attendee
    const [result] = await db.query(
      `INSERT INTO users
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