// // // // import { Component,OnInit,ElementRef,ViewChild } from '@angular/core';
// // // // import { ActivatedRoute } from '@angular/router';
// // // // import { io } from "socket.io-client";

// // // // @Component({
// // // //   selector:'app-webinar-meeting',
// // // //   templateUrl:'./webinar-meeting.component.html'
// // // // })
// // // // export class WebinarMeetingComponent implements OnInit{

// // // //   meetingId:any
// // // //   socket:any

// // // //   userId:any

// // // //   message=""
// // // //   messages:any[]=[]

// // // //   @ViewChild("localVideo") localVideo!:ElementRef

// // // //   constructor(private route:ActivatedRoute){}

// // // //   ngOnInit(){

// // // //     this.meetingId = this.route.snapshot.paramMap.get('id')

// // // //     this.socket = io("http://localhost:5000")

// // // //     this.userId = Math.floor(Math.random()*10000)

// // // //     // JOIN ROOM

// // // //     this.socket.emit("join-meeting",{
// // // //       meetingId:this.meetingId,
// // // //       userId:this.userId,
// // // //       role:"attendee"
// // // //     })

// // // //     this.socket.on("user-connected",(user:any)=>{

// // // //       console.log("User joined:",user)

// // // //     })

// // // //     this.startVideo()

// // // //     // RECEIVE CHAT

// // // //     this.socket.on("receive-message",(data:any)=>{

// // // //       this.messages.push(data)

// // // //     })

// // // //   }

// // // //   // START VIDEO

// // // //   startVideo(){

// // // //     navigator.mediaDevices.getUserMedia({

// // // //       video:true,
// // // //       audio:true

// // // //     })
// // // //     .then(stream=>{

// // // //       this.localVideo.nativeElement.srcObject = stream

// // // //     })

// // // //   }


// // // //   // SEND CHAT

// // // //   sendMessage(){

// // // //     this.socket.emit("send-message",{

// // // //       meetingId:this.meetingId,
// // // //       user:this.userId,
// // // //       message:this.message

// // // //     })

// // // //     this.message=""

// // // //   }


// // // //   // SCREEN SHARE

// // // //   shareScreen(){

// // // //     navigator.mediaDevices.getDisplayMedia({

// // // //       video:true

// // // //     })
// // // //     .then(stream=>{

// // // //       this.localVideo.nativeElement.srcObject = stream

// // // //       this.socket.emit("start-screen-share",this.meetingId)

// // // //     })

// // // //   }

// // // // }

// // // import { Component,OnInit,ElementRef,ViewChild } from '@angular/core';
// // // import { ActivatedRoute } from '@angular/router';
// // // import { io } from "socket.io-client";

// // // @Component({
// // //   selector:'app-webinar-meeting',
// // //   templateUrl:'./webinar-meeting.component.html'
// // // })
// // // export class WebinarMeetingComponent implements OnInit{

// // //   meetingId:any
// // //   socket:any

// // //   userId:any
// // //   token:any

// // //   message=""
// // //   messages:any[]=[]

// // //   @ViewChild("localVideo") localVideo!:ElementRef

// // //   constructor(private route:ActivatedRoute){}

// // //   ngOnInit(){

// // //     this.meetingId = this.route.snapshot.paramMap.get('id')

// // //     // GET TOKEN
// // //     this.token = localStorage.getItem("token")

// // //     this.socket = io("http://localhost:5000",{
// // //       auth:{
// // //         token:this.token
// // //       }
// // //     })

// // //     this.userId = Math.floor(Math.random()*10000)

// // //     // JOIN ROOM
// // //     this.socket.emit("join-meeting",{
// // //       meetingId:this.meetingId,
// // //       userId:this.userId,
// // //       role:"attendee",
// // //       token:this.token
// // //     })

// // //     this.socket.on("user-connected",(user:any)=>{
// // //       console.log("User joined:",user)
// // //     })

// // //     this.startVideo()

// // //     // RECEIVE CHAT
// // //     this.socket.on("receive-message",(data:any)=>{
// // //       this.messages.push(data)
// // //     })

// // //   }

// // //   startVideo(){

// // //     navigator.mediaDevices.getUserMedia({
// // //       video:true,
// // //       audio:true
// // //     })
// // //     .then(stream=>{
// // //       this.localVideo.nativeElement.srcObject = stream
// // //     })

// // //   }

// // //   sendMessage(){

// // //     this.socket.emit("send-message",{
// // //       meetingId:this.meetingId,
// // //       user:this.userId,
// // //       message:this.message,
// // //       token:this.token
// // //     })

// // //     this.message=""

// // //   }

// // //   shareScreen(){

// // //     navigator.mediaDevices.getDisplayMedia({
// // //       video:true
// // //     })
// // //     .then(stream=>{
// // //       this.localVideo.nativeElement.srcObject = stream
// // //       this.socket.emit("start-screen-share",this.meetingId)
// // //     })

// // //   }

// // // }

// // import { Component,OnInit,ElementRef,ViewChild } from '@angular/core';
// // import { ActivatedRoute } from '@angular/router';
// // import { io } from "socket.io-client";

// // @Component({
// //   selector:'app-webinar-meeting',
// //   templateUrl:'./webinar-meeting.component.html'
// // })
// // export class WebinarMeetingComponent implements OnInit{

// //   meetingId:any
// //   socket:any

// //   userId:any
// //   token:any

// //   message=""
// //   messages:any[]=[]

// //   localStream:any
// //   peerConnections:any = {}

// //   @ViewChild("localVideo") localVideo!:ElementRef

// //   constructor(private route:ActivatedRoute){}

// //   ngOnInit(){

// //     this.meetingId = this.route.snapshot.paramMap.get('id')

// //     this.token = localStorage.getItem("token")

// //     this.socket = io("http://localhost:5000",{
// //       auth:{ token:this.token }
// //     })

// //     this.userId = Math.floor(Math.random()*10000)

// //     this.startVideo()

// //     // JOIN ROOM
// //     this.socket.emit("join-meeting",{
// //       meetingId:this.meetingId,
// //       userId:this.userId,
// //       role:"attendee",
// //       token:this.token
// //     })

// //     // NEW USER JOINED
// //     this.socket.on("user-connected",(user:any)=>{

// //       console.log("User joined:",user)

// //       this.createOffer(user.socketId)

// //     })
// //     this.socket.on("existing-users",(users:any)=>{

// //   console.log("Existing users:",users)

// //   users.forEach((id:any)=>{
// //     this.createOffer(id)
// //   })

// // })

// //     // RECEIVE SIGNALS
// //     this.socket.on("signal",async({from,signal}:any)=>{

// //       if(signal.type==="offer"){

// //         const pc = this.createPeerConnection(from)

// //         await pc.setRemoteDescription(signal)

// //         const answer = await pc.createAnswer()

// //         await pc.setLocalDescription(answer)

// //         this.socket.emit("signal",{
// //           to:from,
// //           signal:pc.localDescription
// //         })

// //       }

// //       else if(signal.type==="answer"){

// //         await this.peerConnections[from].setRemoteDescription(signal)

// //       }

// //       else if(signal.candidate){

// //         this.peerConnections[from].addIceCandidate(signal)

// //       }

// //     })

// //     // RECEIVE CHAT
// //     this.socket.on("receive-message",(data:any)=>{
// //       this.messages.push(data)
// //     })

// //   }


// //   async startVideo(){

// //     this.localStream = await navigator.mediaDevices.getUserMedia({
// //       video:true,
// //       audio:true
// //     })

// //     this.localVideo.nativeElement.srcObject = this.localStream

// //   }


// //   createPeerConnection(socketId:any){

// //     const pc = new RTCPeerConnection({
// //       iceServers:[
// //         {urls:"stun:stun.l.google.com:19302"}
// //       ]
// //     })

// //     this.peerConnections[socketId] = pc

// //     // ADD LOCAL STREAM
// //     this.localStream.getTracks().forEach((track:any)=>{
// //       pc.addTrack(track,this.localStream)
// //     })

// //     // RECEIVE REMOTE STREAM
// //     pc.ontrack = (event:any)=>{

// //       let video = document.getElementById(socketId) as HTMLVideoElement

// //       if(!video){

// //         video = document.createElement("video")
// //         video.id = socketId
// //         video.autoplay = true
// //         video.width = 250

// //         document.getElementById("remoteVideos")?.appendChild(video)

// //       }

// //       video.srcObject = event.streams[0]

// //     }

// //     // ICE CANDIDATE
// //     pc.onicecandidate = (event:any)=>{

// //       if(event.candidate){

// //         this.socket.emit("signal",{
// //           to:socketId,
// //           signal:event.candidate
// //         })

// //       }

// //     }

// //     return pc

// //   }


// //   async createOffer(socketId:any){

// //     const pc = this.createPeerConnection(socketId)

// //     const offer = await pc.createOffer()

// //     await pc.setLocalDescription(offer)

// //     this.socket.emit("signal",{
// //       to:socketId,
// //       signal:offer
// //     })

// //   }


// //   sendMessage(){

// //     this.socket.emit("send-message",{
// //       meetingId:this.meetingId,
// //       user:this.userId,
// //       message:this.message,
// //       token:this.token
// //     })

// //     this.message=""

// //   }


// //   async shareScreen(){

// //     const screenStream = await navigator.mediaDevices.getDisplayMedia({
// //       video:true
// //     })

// //     const screenTrack = screenStream.getTracks()[0]

// //     this.localVideo.nativeElement.srcObject = screenStream

// //     for(const id in this.peerConnections){

// //       const sender = this.peerConnections[id]
// //         .getSenders()
// //         .find((s:any)=>s.track.kind==="video")

// //       sender.replaceTrack(screenTrack)

// //     }

// //     this.socket.emit("start-screen-share",this.meetingId)

// //   }


// //   toggleMic(){

// //     const audioTrack = this.localStream.getAudioTracks()[0]

// //     audioTrack.enabled = !audioTrack.enabled

// //   }


// //   toggleCamera(){

// //     const videoTrack = this.localStream.getVideoTracks()[0]

// //     videoTrack.enabled = !videoTrack.enabled

// //   }

// // }

// import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { io } from "socket.io-client";

// @Component({
//   selector: 'app-webinar-meeting',
//   templateUrl: './webinar-meeting.component.html'
// })
// export class WebinarMeetingComponent implements OnInit {

//   meetingId: any;
//   socket: any;

//   userId: any;
//   token: any;

//   message = "";
//   messages: any[] = [];

//   localStream: MediaStream | null = null;
//   peerConnections: { [key: string]: RTCPeerConnection } = {};

//   @ViewChild("localVideo") localVideo!: ElementRef<HTMLVideoElement>;

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit() {
//     this.meetingId = this.route.snapshot.paramMap.get('id');
//     this.token = localStorage.getItem("token");
//     this.userId = Math.floor(Math.random() * 10000);

//     this.socket = io("http://localhost:5000", {
//       auth: { token: this.token }
//     });

//     this.startVideo();

//     // JOIN ROOM
//     this.socket.emit("join-meeting", {
//       meetingId: this.meetingId,
//       userId: this.userId,
//       role: "attendee",
//       token: this.token
//     });

//     // NEW USER JOINED
//     this.socket.on("user-connected", (user: any) => {
//       console.log("User joined:", user);
//       this.createOffer(user.socketId);
//     });

//     // EXISTING USERS
//     this.socket.on("existing-users", (users: any) => {
//       console.log("Existing users:", users);
//       users.forEach((id: any) => this.createOffer(id));
//     });

//     // RECEIVE SIGNALS
//     this.socket.on("signal", async ({ from, signal }: any) => {
//       const pc = this.peerConnections[from] || this.createPeerConnection(from);

//       if (signal.sdp) {
//         await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
//         if (signal.sdp.type === "offer") {
//           const answer = await pc.createAnswer();
//           await pc.setLocalDescription(answer);
//           this.socket.emit("signal", { to: from, signal: { sdp: answer } });
//         }
//       } else if (signal.candidate) {
//         try {
//           await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
//         } catch (err) {
//           console.error("Error adding ICE candidate", err);
//         }
//       }
//     });

//     // RECEIVE CHAT
//     this.socket.on("receive-message", (data: any) => {
//       this.messages.push(data);
//     });
//   }

//   async startVideo() {
//     this.localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true
//     });

//     this.localVideo.nativeElement.srcObject = this.localStream;
//     this.localVideo.nativeElement.muted = true; // prevent echo
//     this.localVideo.nativeElement.autoplay = true;
//     this.localVideo.nativeElement.playsInline = true;
//   }

//   createPeerConnection(socketId: any): RTCPeerConnection {
//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
//     });

//     this.peerConnections[socketId] = pc;

//     // ADD LOCAL STREAM
//     this.localStream?.getTracks().forEach(track => {
//       pc.addTrack(track, this.localStream!);
//     });

//     // RECEIVE REMOTE STREAM
//     pc.ontrack = (event: RTCTrackEvent) => {
//       let video = document.getElementById(socketId) as HTMLVideoElement;
//       if (!video) {
//         video = document.createElement("video");
//         video.id = socketId;
//         video.autoplay = true;
//         video.playsInline = true;
//         video.width = 250;
//         document.getElementById("remoteVideos")?.appendChild(video);
//       }
//       video.srcObject = event.streams[0];
//     };

//     // ICE CANDIDATE
//     pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
//       if (event.candidate) {
//         this.socket.emit("signal", {
//           to: socketId,
//           signal: { candidate: event.candidate }
//         });
//       }
//     };

//     return pc;
//   }

//   async createOffer(socketId: any) {
//     const pc = this.createPeerConnection(socketId);
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     this.socket.emit("signal", { to: socketId, signal: { sdp: offer } });
//   }

//   sendMessage() {
//     this.socket.emit("send-message", {
//       meetingId: this.meetingId,
//       user: this.userId,
//       message: this.message,
//       token: this.token
//     });
//     this.message = "";
//   }

//   async shareScreen() {
//     const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//     const screenTrack = screenStream.getTracks()[0];

//     this.localVideo.nativeElement.srcObject = screenStream;

//     for (const id in this.peerConnections) {
//       const sender = this.peerConnections[id]
//         .getSenders()
//         .find(s => s.track && s.track.kind === "video");
//       if (sender) sender.replaceTrack(screenTrack);
//     }

//     this.socket.emit("start-screen-share", this.meetingId);

//     // Restore camera when screen sharing stops
//     screenTrack.onended = () => {
//       if (this.localStream) {
//         const camTrack = this.localStream.getVideoTracks()[0];
//         for (const id in this.peerConnections) {
//           const sender = this.peerConnections[id]
//             .getSenders()
//             .find(s => s.track && s.track.kind === "video");
//           if (sender) sender.replaceTrack(camTrack);
//         }
//         this.localVideo.nativeElement.srcObject = this.localStream;
//         this.socket.emit("stop-screen-share", this.meetingId);
//       }
//     };
//   }

//   toggleMic() {
//     const audioTrack = this.localStream?.getAudioTracks()[0];
//     if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
//   }

//   toggleCamera() {
//     const videoTrack = this.localStream?.getVideoTracks()[0];
//     if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
//   }
// }
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from "socket.io-client";

@Component({
  selector: 'app-webinar-meeting',
  templateUrl: './webinar-meeting.component.html',
  styleUrls: ['./webinar-meeting.component.css']
})
export class WebinarMeetingComponent implements OnInit {

  meetingId: any;
  socket: any;

  userId: any;
  token: any;

  message = "";
  messages: any[] = [];

  localStream: MediaStream | null = null;
  peerConnections: { [key: string]: RTCPeerConnection } = {};

  @ViewChild("localVideo") localVideo!: ElementRef<HTMLVideoElement>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id');
    this.token = localStorage.getItem("token");
    this.userId = Math.floor(Math.random() * 10000);

    this.socket = io("http://localhost:5000", {
      auth: { token: this.token }
    });

    this.startVideo();

    // JOIN ROOM
    this.socket.emit("join-meeting", {
      meetingId: this.meetingId,
      userId: this.userId,
      role: "attendee",
      token: this.token
    });

    // EXISTING USERS (new user receives list, but does NOT create offers)
    this.socket.on("existing-users", (users: any) => {
      console.log("Existing users:", users);
      // Just wait for offers from them
    });

    // NEW USER JOINED (existing users create offers to new one)
    this.socket.on("user-connected", (user: any) => {
      console.log("User joined:", user);
      this.createOffer(user.socketId);
    });

    // RECEIVE SIGNALS
    this.socket.on("signal", async ({ from, signal }: any) => {
      let pc = this.peerConnections[from] || this.createPeerConnection(from);

      if (signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          this.socket.emit("signal", { to: from, signal: { sdp: answer } });
        }
      } else if (signal.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      }
    });

    // RECEIVE CHAT
    this.socket.on("receive-message", (data: any) => {
      this.messages.push(data);
    });

    // SCREEN SHARE EVENTS
    this.socket.on("screen-share-started", () => {
      console.log("Another user started screen sharing");
      // You can adjust UI here (e.g., enlarge remote video)
    });

    this.socket.on("screen-share-stopped", () => {
      console.log("Screen sharing stopped");
      // Switch UI back to normal camera view if needed
    });
  }

  async startVideo() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    this.localVideo.nativeElement.srcObject = this.localStream;
    this.localVideo.nativeElement.muted = true; // prevent echo
    this.localVideo.nativeElement.autoplay = true;
    this.localVideo.nativeElement.playsInline = true;
  }

  createPeerConnection(socketId: any): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    this.peerConnections[socketId] = pc;

    // ADD LOCAL STREAM
    this.localStream?.getTracks().forEach(track => {
      pc.addTrack(track, this.localStream!);
    });

    // RECEIVE REMOTE STREAM
    pc.ontrack = (event: RTCTrackEvent) => {
      let video = document.getElementById(socketId) as HTMLVideoElement;
      if (!video) {
        video = document.createElement("video");
        video.id = socketId;
        video.autoplay = true;
        video.playsInline = true;
        video.width = 250;
        document.getElementById("remoteVideos")?.appendChild(video);
      }
      // Always update with the latest stream (camera or screen)
      video.srcObject = event.streams[0];
    };

    // ICE CANDIDATE
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        this.socket.emit("signal", {
          to: socketId,
          signal: { candidate: event.candidate }
        });
      }
    };

    return pc;
  }

  async createOffer(socketId: any) {
    const pc = this.createPeerConnection(socketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.socket.emit("signal", { to: socketId, signal: { sdp: offer } });
  }

  sendMessage() {
    this.socket.emit("send-message", {
      meetingId: this.meetingId,
      user: this.userId,
      message: this.message,
      token: this.token
    });
    this.message = "";
  }

  async shareScreen() {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = screenStream.getTracks()[0];

    this.localVideo.nativeElement.srcObject = screenStream;

    for (const id in this.peerConnections) {
      const sender = this.peerConnections[id]
        .getSenders()
        .find(s => s.track && s.track.kind === "video");
      if (sender) sender.replaceTrack(screenTrack);
    }

    this.socket.emit("start-screen-share", this.meetingId);

    // Restore camera when screen sharing stops
    screenTrack.onended = () => {
      if (this.localStream) {
        const camTrack = this.localStream.getVideoTracks()[0];
        for (const id in this.peerConnections) {
          const sender = this.peerConnections[id]
            .getSenders()
            .find(s => s.track && s.track.kind === "video");
          if (sender) sender.replaceTrack(camTrack);
        }
        this.localVideo.nativeElement.srcObject = this.localStream;
        this.socket.emit("stop-screen-share", this.meetingId);
      }
    };
  }

  toggleMic() {
    const audioTrack = this.localStream?.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
  }

  toggleCamera() {
    const videoTrack = this.localStream?.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
  }
}
