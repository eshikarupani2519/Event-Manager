import { Component } from '@angular/core';
import { EventService } from '../event.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent {

  events:any[]=[];
  loading=false;

  constructor(private eventService:EventService){}

  loadSuggestions(){

    this.loading=true;
// replace this by actual logged in person's data later
    let payload={
      attendee:{
        id:1,
        name:"Eshika Rupani",
        interests:["AI","Machine Learning","Cloud"]
      },
      event:[]
    }
    const token = localStorage.getItem('token');
    console.log(token);
   let headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
    this.eventService.getAttendeeById().subscribe({
      next:(res:any)=>{
        console.log("attendee:",res);
        payload.attendee=res;
      }
    })
    this.eventService.getAllEvents({headers:headers}).subscribe({
      next:(res:any)=>{
        payload.event=res;
        console.log(res);
        console.log(payload)
         this.eventService.getEventSuggestions(headers,payload)
      .subscribe({
        next:(res:any)=>{
          
          console.log(res);
        this.events=res;
        this.loading=false;
        },
        error:(err:any)=>{
          console.log(err);
        }
      });

      },
      error:(err:any)=>{
        console.log(err)
      }
    })
   

  }
}
