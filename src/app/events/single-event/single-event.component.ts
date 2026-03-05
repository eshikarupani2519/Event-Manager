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
      this.eventService.getEventById(+this.id).subscribe({
        next: (eve) => {
          this.event = eve; // This line populates the event object
          console.log('event data loaded:', this.event.event);
          console.log('attendees:', this.event.totalAttendees[0]['COUNT(*)']);
          this.totalAttendees = this.event.totalAttendees[0]['COUNT(*)'];
          this.event_name = this.event.event.event_name;
          this.event_description = this.event.event.event_description;
          this.event_type = this.event.event.event_type;
          this.timing = this.event.event.timing;
          this.event_date = this.event.event.event_date.substring(0, 10);
        },
        error: (error) => {
          console.error('Error fetching event data:', error);
          // Handle error, e.g., show an error message
        }
      });
    }
  }


}
