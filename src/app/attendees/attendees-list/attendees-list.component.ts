import { Component } from '@angular/core';
import { AttendeesService } from '../attendees.service';
import { finalize } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.css']
})
export class AttendeesListComponent {
events: any;
  event_attendees:any;
   selectedEventId: number | null = null;
  selectedEventAttendees: any[] = [];
isLoading:boolean=false;
attendeesLength:number=0;
headers:any;
attendees:any;
  constructor(private attendeeService:AttendeesService,private router:Router) {}

  ngOnInit(): void {
 const token = localStorage.getItem('token'); // token saved after login
      if (!token) {
        console.error('No token found in localStorage!');
       alert("Login first")
    this.router.navigate([''])
      }
      
     this.headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  this.loadEvents();
  }
loadEvents(){
  this.isLoading = true;
        this.attendeeService.getAllEvents({headers: this.headers}).pipe(
          finalize(() => {
            this.isLoading = false; // Hide loader after fetching events
          })
        ).subscribe({
          next: (events) => {
            this.events = events ;
           
            
            
          },
          error: (err) => {
            console.error('Error fetching events:', err);
            alert('Failed to load events. Please try again.');
          }
        });
}
  onEventChange() {
    const entry = this.events.find((e:any) => e.event_id === this.selectedEventId);
    console.log(entry)
    this.loadAttendees(entry.event_id)
  }
   loadAttendees(eventId: string): void {
    this.attendeeService.getAttendeeByEventId(eventId,this.headers).subscribe({
      next: (res:any) => {
        console.log('Fetched attendees', res[0]);
     
        this.attendees = res[0];
        this.attendeesLength=this.attendees.length;
        console.log(this.attendeesLength)
      },
      error: (err) => {
        console.error('Error fetching attendees', err);
      }
    });
  }
}
