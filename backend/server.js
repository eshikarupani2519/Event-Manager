require("dotenv").config()
const routes=require("./routes");
const path=require("path")
const express=require("express")
const cors=require("cors")
const app=express()

const db = require('./models/db');
app.use(express.json())
app.use(cors())  //CROSS ORIGIN RESOURCE SHARING
//alag alag ports ko aapas mein baat karni hoti hai communicate karna hota hai but resources share karne hai jaise integrity bani rahe

app.use('/api',routes);
const PORT = process.env.PORT || 5000 ;
app.listen(PORT,()=>{
    console.log("backend successfully running on port ",PORT)
})
