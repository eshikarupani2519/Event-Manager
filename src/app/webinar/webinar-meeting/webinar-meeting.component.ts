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

  async ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id');
    this.token = localStorage.getItem("token");
    this.userId = Math.floor(Math.random() * 10000);

    this.socket = io("http://localhost:5000", {
      auth: { token: this.token }
    });

    await this.startVideo();

    // JOIN ROOM
    this.socket.emit("join-meeting", {
      meetingId: this.meetingId,
      userId: this.userId,
      role: "attendee",
      token: this.token
    });

    // EXISTING USERS: create offer to all existing users
    this.socket.on("existing-users", (users: any[]) => {
      users.forEach(user => {
        this.createOffer(user.socketId);
      });
    });

    // NEW USER JOINED: create offer from existing users
    this.socket.on("user-connected", (user: any) => {
      this.createOffer(user.socketId);
    });

    // RECEIVE SIGNALS (offer/answer/candidate)
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

    // CHAT
    this.socket.on("receive-message", (data: any) => {
      this.messages.push(data);
    });

    // SCREEN SHARE EVENTS (UI updates)
    this.socket.on("screen-share-started", (userId: any) => {
      console.log(`User ${userId} started screen sharing`);
    });

    this.socket.on("screen-share-stopped", (userId: any) => {
      console.log(`User ${userId} stopped screen sharing`);
    });
  }

  // GET LOCAL CAMERA + MIC
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
    this.localStream?.getTracks().forEach(track => pc.addTrack(track, this.localStream!));

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

  // SCREEN SHARE
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

    this.socket.emit("start-screen-share", { meetingId: this.meetingId, userId: this.userId });

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
        this.socket.emit("stop-screen-share", { meetingId: this.meetingId, userId: this.userId });
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