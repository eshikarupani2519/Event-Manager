import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io } from "socket.io-client";

@Component({
  selector:'app-webinar-meeting',
  templateUrl:'./webinar-meeting.component.html'
})
export class WebinarMeetingComponent implements OnInit{

  meetingId:any
  socket:any

  constructor(private route:ActivatedRoute){}

  ngOnInit(){

    this.meetingId = this.route.snapshot.paramMap.get('id')

    this.socket = io("http://localhost:5000")

    const userId = Math.floor(Math.random()*10000)

    this.socket.emit("join-meeting",this.meetingId,userId)

    this.socket.on("user-connected",(user:any)=>{

      console.log("User joined:",user)

    })

  }

}