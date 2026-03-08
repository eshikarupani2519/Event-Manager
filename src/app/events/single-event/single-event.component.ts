import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent {
  id: string | null = null;
  event: any = null;
  event_name: any;
  event_description: any;
  event_type: any;
  timing: any;
  event_date: any;
  totalAttendees: any;
  isLoading: boolean = false;
  headers: any;
  event_mode: any;
total_seats: any;
available_seats: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

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
    // Get the event ID from the URL parameters

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    // Fetch the event data using the new service method
    if (this.id) { // Ensure the ID exists before making the call
      // this.eventService.getEventById(+this.id).subscribe({
      //   next: (eve) => {
      //     this.event = eve; // This line populates the event object
      //     console.log('event data loaded:', this.event.event);
      //     console.log('attendees:', this.event.totalAttendees[0]['COUNT(*)']);
      //     this.totalAttendees = this.event.totalAttendees[0]['COUNT(*)'];
      //     this.event_name = this.event.event.event_name;
      //     this.event_description = this.event.event.event_description;
      //     this.event_type = this.event.event.event_type;
      //     this.timing = this.event.event.timing;
      //     this.event_date = this.event.event.event_date.substring(0, 10);
      //   },
      //   error: (error) => {
      //     console.error('Error fetching event data:', error);
      //     // Handle error, e.g., show an error message
      //   }
      // });
//       this.eventService.getEventById(+this.id).subscribe({
//   next: (res: any) => {

//     console.log("event data loaded:", res);

//     this.event = res;

//     this.event_name = res.event_name;
//     this.event_description = res.event_description;
//     this.event_type = res.event_type;
//     this.timing = res.timing;

//     if (res.event_date) {
//       this.event_date = res.event_date.substring(0, 10);
//     }

//     // If backend sends attendee count
//     this.totalAttendees = res.totalAttendees || 0;

//   },
//   error: (error) => {
//     console.error('Error fetching event data:', error);
//   }
// });
// this.eventService.getEventById(+this.id).subscribe({
//   next: (res: any) => {

//     console.log("event data loaded:", res);

//     const eventData = res.event || res;

//     this.event_name = eventData.event_name;
//     this.event_description = eventData.event_description;
//     this.event_type = eventData.event_type;
//     this.timing = eventData.timing;

//     if (eventData.event_date) {
//       this.event_date = eventData.event_date.substring(0, 10);
//     }

//     if (res.totalAttendees && res.totalAttendees.length > 0) {
//       this.totalAttendees = res.totalAttendees[0]['COUNT(*)'];
//     } else {
//       this.totalAttendees = 0;
//     }

//   },
//   error: (error) => {
//     console.error('Error fetching event data:', error);
//   }
// });
this.eventService.getEventById(+this.id).subscribe({
  next: (res: any) => {

    console.log("event data loaded:", res);

    const eventData = res.event || res;

    this.event_name = eventData.event_name;
    this.event_description = eventData.event_description;
    this.event_type = eventData.event_type;
    this.timing = eventData.timing;

    if (eventData.event_date) {
      this.event_date = eventData.event_date.substring(0, 10);
    }

    // 👇 ADD THESE
    this.event_mode = eventData.event_mode;
    this.total_seats = eventData.total_seats;
    this.available_seats = eventData.available_seats;

    // if (res.totalAttendees && res.totalAttendees.length > 0) {
    //   this.totalAttendees = res.totalAttendees[0]['COUNT(*)'];
    // } else {
    //   this.totalAttendees = 0;
    // }
    this.totalAttendees = res.total_attendees !== undefined ? res.total_attendees : 0;

  },
  error: (error) => {
    console.error('Error fetching event data:', error);
  }
});
    }
  }


}
