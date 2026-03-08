import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from "socket.io-client";
import { EventService } from '../../events/event.service';

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

  recorder: any;          // recording object
  chunks: any[] = [];  
  summary:any
recording:any
transcript:any   // recorded video chunks

  @ViewChild("localVideo") localVideo!: ElementRef<HTMLVideoElement>;

  constructor(private route: ActivatedRoute,private eventService: EventService) {}

  async ngOnInit() {

    this.meetingId = this.route.snapshot.paramMap.get('id');
    this.loadSummary()
    this.token = localStorage.getItem("token");
    this.userId = Math.floor(Math.random() * 10000);

    this.socket = io("http://localhost:5000", {
      auth: { token: this.token }
    });
    

    await this.startVideo();

    // START RECORDING AFTER VIDEO STARTS
    if(this.localStream){
      this.startRecording(this.localStream);
    }

    // JOIN ROOM
    this.socket.emit("join-meeting", {
      meetingId: this.meetingId,
      userId: this.userId,
      role: "attendee",
      token: this.token
    });

    // EXISTING USERS
    this.socket.on("existing-users", (users: any[]) => {
      users.forEach(user => {
        this.createOffer(user.socketId);
      });
    });

    // NEW USER JOINED
    this.socket.on("user-connected", (user: any) => {
      this.createOffer(user.socketId);
    });

    // SIGNAL HANDLING
    this.socket.on("signal", async ({ from, signal }: any) => {

      let pc = this.peerConnections[from] || this.createPeerConnection(from);

      if (signal.sdp) {

        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        if (signal.sdp.type === "offer") {

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          this.socket.emit("signal", {
            to: from,
            signal: { sdp: answer }
          });

        }

      }
      else if (signal.candidate) {

        try {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
        catch (err) {
          console.error("Error adding ICE candidate", err);
        }

      }

    });

    // CHAT
    this.socket.on("receive-message", (data: any) => {
      this.messages.push(data);
    });

    // SCREEN SHARE EVENTS
    this.socket.on("screen-share-started", (userId: any) => {
      console.log(`User ${userId} started screen sharing`);
    });

    this.socket.on("screen-share-stopped", (userId: any) => {
      console.log(`User ${userId} stopped screen sharing`);
    });

  }

  // START CAMERA + MIC
  async startVideo() {

    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    this.localVideo.nativeElement.srcObject = this.localStream;
    this.localVideo.nativeElement.muted = true;
    this.localVideo.nativeElement.autoplay = true;
    this.localVideo.nativeElement.playsInline = true;

  }

  // CREATE PEER CONNECTION
  createPeerConnection(socketId: any): RTCPeerConnection {

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    this.peerConnections[socketId] = pc;

    // ADD LOCAL TRACKS
    this.localStream?.getTracks().forEach(track =>
      pc.addTrack(track, this.localStream!)
    );

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

  // CREATE OFFER
  async createOffer(socketId: any) {

    const pc = this.createPeerConnection(socketId);

    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);

    this.socket.emit("signal", {
      to: socketId,
      signal: { sdp: offer }
    });

  }

  // SEND CHAT MESSAGE
  sendMessage() {

    this.socket.emit("send-message", {
      meetingId: this.meetingId,
      user: this.userId,
      message: this.message,
      token: this.token
    });

    this.message = "";

  }
  async endCall(){

  // stop recording
  if(this.recorder){
    this.stopRecording()
  }

  // stop camera + mic
  this.localStream?.getTracks().forEach(track=>{
    track.stop()
  })

  // close peer connections
  for(const id in this.peerConnections){
    this.peerConnections[id].close()
  }

  // disconnect socket
  if(this.socket){
    this.socket.disconnect()
  }

  alert("Call ended")

  window.location.href="/"

}


  // SCREEN SHARE
  async shareScreen() {

    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });

    const screenTrack = screenStream.getTracks()[0];

    this.localVideo.nativeElement.srcObject = screenStream;

    for (const id in this.peerConnections) {

      const sender = this.peerConnections[id]
        .getSenders()
        .find(s => s.track && s.track.kind === "video");

      if (sender) sender.replaceTrack(screenTrack);

    }

    this.socket.emit("start-screen-share", {
      meetingId: this.meetingId,
      userId: this.userId
    });

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

        this.socket.emit("stop-screen-share", {
          meetingId: this.meetingId,
          userId: this.userId
        });

      }

    };

  }

  toggleMic() {

    const audioTrack = this.localStream?.getAudioTracks()[0];

    if (audioTrack)
      audioTrack.enabled = !audioTrack.enabled;

  }

  toggleCamera() {

    const videoTrack = this.localStream?.getVideoTracks()[0];

    if (videoTrack)
      videoTrack.enabled = !videoTrack.enabled;

  }

  // START RECORDING
  startRecording(stream: MediaStream) {

    this.recorder = new MediaRecorder(stream);

    this.recorder.ondataavailable = (e: any) => {
      this.chunks.push(e.data);
    };

    this.recorder.start();

    console.log("Recording started");

  }

  // STOP RECORDING
  stopRecording() {

    this.recorder.stop();

    this.recorder.onstop = async () => {

      const blob = new Blob(this.chunks, { type: 'video/webm' });

      const formData = new FormData();
      formData.append("file", blob, "webinar.webm");

      await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });

      console.log("Recording uploaded");

    };

  }
  //  private eventService: EventService;
//    loadSummary(){

//   const eventId = this.meetingId

//   this.eventService.getSummary(eventId).subscribe((data:any)=>{

//     this.summary = data.summary
//     this.recording = data.recording_url
//     this.transcript = data.transcript

//   })

// }
loadSummary(){

  if(!this.meetingId) return

  this.eventService.getSummary(this.meetingId).subscribe({
    next:(data:any)=>{
      console.log("Summary response:",data)

      this.summary = data.summary
      this.recording = data.recording_url
      this.transcript = data.transcript
    },
    error:(err)=>{
      console.log("Summary error:",err)
    }
  })

}

}