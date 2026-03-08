import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:any = {};
  registeredEvents:any[] = [];
  hostedEvents:any[] = [];

  token:any = localStorage.getItem("token");

  constructor(private http:HttpClient){}

  ngOnInit(){

    this.getProfile();

    this.getEvents();

  }

  getProfile(){

    this.http.get("http://localhost:5000/api/attendee",{
      headers:{
        Authorization:`Bearer ${this.token}`
      }
    })
    .subscribe((res:any)=>{
      this.user = res.attendee[0];
    });

  }

  getEvents(){

    this.http.get("http://localhost:5000/api/events",{
      headers:{
        Authorization:`Bearer ${this.token}`
      }
    })
    .subscribe((res:any)=>{

      this.registeredEvents = res;

    });

  }

}