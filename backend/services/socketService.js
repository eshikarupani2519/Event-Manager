module.exports = function(io){

    io.on("connection",(socket)=>{

        console.log("User connected:",socket.id)

        socket.on("join-meeting",(meetingId,userId)=>{

            socket.join(meetingId)

            socket.to(meetingId).emit("user-connected",userId)

        })

        socket.on("disconnect",()=>{

            console.log("User disconnected")

        })

    })

}