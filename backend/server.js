require("dotenv").config()
require("./services/webinarScheduler")


const routes = require("./routes")
const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"*"
    }
})
require("./services/socketService")(io)

app.use(express.json())
app.use(cors())

app.use("/api",routes)


const PORT = process.env.PORT || 5000

server.listen(PORT,()=>{
    console.log("Backend running on port",PORT)
})