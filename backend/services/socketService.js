// module.exports = function(io){

//     io.on("connection",(socket)=>{

//         console.log("User connected:",socket.id)

//         socket.on("join-meeting",(meetingId,userId)=>{

//             socket.join(meetingId)

//             socket.to(meetingId).emit("user-connected",userId)

//         })

//         socket.on("disconnect",()=>{

//             console.log("User disconnected")

//         })

//     })

// }

module.exports = function (io) {

    const users = {}

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id)

        // =========================
        // JOIN MEETING
        // =========================

        socket.on("join-meeting", ({ meetingId, userId, role }) => {

            socket.join(meetingId)

            users[socket.id] = {
                meetingId,
                userId,
                role
            }

            console.log(userId, "joined meeting", meetingId)

            socket.to(meetingId).emit("user-connected", {
                userId,
                socketId: socket.id,
                role
            })

        })


        // =========================
        // VIDEO SIGNALING
        // =========================

        socket.on("signal", ({ to, signal }) => {

            io.to(to).emit("signal", {
                from: socket.id,
                signal
            })

        })


        // =========================
        // CHAT
        // =========================

        socket.on("send-message", ({ meetingId, user, message }) => {

            io.to(meetingId).emit("receive-message", {
                user,
                message,
                time: new Date()
            })

        })


        // =========================
        // SCREEN SHARE
        // =========================

        socket.on("start-screen-share", (meetingId) => {

            const user = users[socket.id]

            if(user.role !== "host" && user.role !== "admin") return

            socket.to(meetingId).emit("screen-share-started")

        })


        socket.on("stop-screen-share", (meetingId) => {

            socket.to(meetingId).emit("screen-share-stopped")

        })


        // =========================
        // START WEBINAR
        // =========================

        socket.on("start-webinar", (meetingId) => {

            const user = users[socket.id]

            if(user.role !== "host" && user.role !== "admin") return

            io.to(meetingId).emit("webinar-started")

        })


        // =========================
        // LEAVE MEETING
        // =========================

        socket.on("leave-meeting", (meetingId) => {

            socket.leave(meetingId)

            socket.to(meetingId).emit("user-disconnected", socket.id)

        })


        socket.on("disconnect", () => {

            console.log("User disconnected:", socket.id)

            const user = users[socket.id]

            if(user){

                socket.to(user.meetingId).emit("user-disconnected", socket.id)

                delete users[socket.id]

            }

        })

    })

}