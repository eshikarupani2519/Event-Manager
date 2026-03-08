import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  addEventForm = new FormGroup({
    event_name: new FormControl('', [Validators.required]),
    event_description: new FormControl('', [Validators.required]),
    event_date: new FormControl('', [Validators.required]),
    event_type: new FormControl('', [Validators.required]),
    timing: new FormControl('', [Validators.required])
  })
  eventId?: any;
  headers: any;
  formTitle: String = 'Add Event'
  constructor(private activatedRoute: ActivatedRoute, private eventService: EventService, private router: Router) { }
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
    this.eventId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.eventId) {
      console.log(this.eventId)
      this.formTitle = 'Edit Event';


      this.eventService.getEventById(this.eventId).subscribe({
        next: (eventData: any) => {
          let year = eventData.event.event_date.substring(0, 4)
          let month = eventData.event.event_date.substring(5, 7)
          let date = eventData.event.event_date.substring(8, 10)
          eventData.event.event_date = year + "-" + month + "-" + date;
          this.addEventForm.patchValue(eventData.event);
        },
        error: (err) => {
          console.error('Error fetching event for edit:', err);
          alert('Could not load event data.');
          this.router.navigate(['/event-list']);
        }
      });
    }
  }

  getFormControl(name: string) {
    return this.addEventForm.get(name) as FormControl;
  }

  isFormControlError(name: string): boolean {
    const control = this.getFormControl(name);
    return !!(control?.errors?.['required'] && control?.dirty);
  }

  onSubmit(): void {

    if (this.addEventForm.valid) {
      if (this.eventId) {
        // Update Logic
        // this.eventService.updateEvent(this.eventId, this.addEventForm.value, { headers: this.headers }).subscribe({
        //   next: (response: any) => {
        //     console.log('event updated successfully', response);
        //     alert('event updated successfully')
        //     this.router.navigate(['/event-list']);
        //   },
        //   error: (error: any) => {
        //     console.error('Error updating event', error);
        //   }
        // });

        // Update Logic
this.eventService.updateEvent(this.eventId, this.addEventForm.value, { headers: this.headers }).subscribe({
  next: (response: any) => {
    console.log('Event updated successfully', response);
    alert('Event updated successfully');
    this.router.navigate(['/event-list']);
  },
  error: (error: any) => {
    console.error('Error updating event', error);
    alert('Failed to update event. ' + (error.error?.message || ''));
  }
});
      } else {
        // Add Logic
        this.eventService.addEvent(this.addEventForm.value, { headers: this.headers }).subscribe({
          next: (response: any) => {
            if (response.message) alert(response.message)
            console.log('event added successfully', response);

            this.router.navigate(['/event-list']);
          },
          error: (error) => {
            if (error.status === 409) {
              alert('Event already exists!');
            }
            else console.error('Error adding event', error);
          }
        });
      }
    }
  }
}
