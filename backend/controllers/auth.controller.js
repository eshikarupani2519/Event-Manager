const jwt = require("jsonwebtoken");

const db = require("../models/db");
let user;
exports.login = async (req, res) => {
  const { username, password } = req.body; 
console.log("RAW req.body:", req.body);
console.log("Headers:", req.headers['content-type']);

  try {
    const result= await db.query("SELECT * FROM admin WHERE username = ?", [username]);
    console.log(result)
     user = result[0][0];

    if (!user) return res.status(401).json({ message: "Invalid username" });

   if (password !== user.password) {
  return res.status(401).json({ message: "Invalid password" });
}
;
   
    const token = jwt.sign(
  { id: user.id,role: user.role }, 
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);


   res.json({ 
  token,
  user: {
    id: user.id,
    name: user.name,
    username: user.username,
   
  }
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
 

};

