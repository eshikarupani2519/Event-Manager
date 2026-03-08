// const crypto = require("crypto");

// const razorpay_order_id = "order_SOJM8LRPlnFIUG"; // your order.id
// const razorpay_payment_id = "pay_FAKE123456789"; // fake payment ID
// const key_secret = "YOUR_RAZORPAY_KEY_SECRET";  

// const body = razorpay_order_id + "|" + razorpay_payment_id;

// const signature = crypto.createHmac("sha256", key_secret)
//                         .update(body.toString())
//                         .digest("hex");

// console.log("Payment ID:", razorpay_payment_id);
// console.log("Signature:", signature);

require("dotenv").config({ path: "../.env" });
const crypto = require("crypto");

const razorpay_order_id = "order_SONhwKP1YlxcQm";
const razorpay_payment_id = "pay_FAKE123456789";
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const body = razorpay_order_id + "|" + razorpay_payment_id;

const signature = crypto.createHmac("sha256", key_secret)
                        .update(body.toString())
                        .digest("hex");

console.log("Payment ID:", razorpay_payment_id);
console.log("Signature:", signature);