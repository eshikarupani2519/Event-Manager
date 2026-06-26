// import { Component } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { EventService } from '../event.service';
// import { HttpHeaders } from '@angular/common/http';

// @Component({
//   selector: 'app-add-event',
//   templateUrl: './add-event.component.html',
//   styleUrls: ['./add-event.component.css']
// })
// export class AddEventComponent {
//   // addEventForm = new FormGroup({
//   //   event_name: new FormControl('', [Validators.required]),
//   //   event_description: new FormControl('', [Validators.required]),
//   //   event_date: new FormControl('', [Validators.required]),
//   //   event_type: new FormControl('', [Validators.required]),
//   //   timing: new FormControl('', [Validators.required])
//   // })
//   addEventForm = new FormGroup({
//   event_name: new FormControl('', [Validators.required]),
//   event_description: new FormControl('', [Validators.required]),
//   event_date: new FormControl('', [Validators.required]),
//   timing: new FormControl('', [Validators.required]),

//   event_type: new FormControl('', [Validators.required]),

//   event_category: new FormControl([], [Validators.required]),

//   event_mode: new FormControl('Online', [Validators.required]),

//   location: new FormControl(''),

//   total_seats: new FormControl(null)
// });
//   eventId?: any;
//   headers: any;
//   formTitle: String = 'Add Event'
//   constructor(private activatedRoute: ActivatedRoute, private eventService: EventService, private router: Router) { }
//   ngOnInit(): void {
//     const token = localStorage.getItem('token'); // token saved after login
//     if (!token) {
//       console.error('No token found in localStorage!');
//       alert("Login first")
//       this.router.navigate([''])
//     }

//     this.headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`
//     });
//     this.eventId = this.activatedRoute.snapshot.paramMap.get('id');
//     if (this.eventId) {
//       console.log(this.eventId)
//       this.formTitle = 'Edit Event';


//       // this.eventService.getEventById(this.eventId).subscribe({

//       //   next: (eventData: any) => {
//       //     let year = eventData.event.event_date.substring(0, 4)
//       //     let month = eventData.event.event_date.substring(5, 7)
//       //     let date = eventData.event.event_date.substring(8, 10)
//       //     eventData.event.event_date = year + "-" + month + "-" + date;
//       //     this.addEventForm.patchValue(eventData.event);
//       //   },
//       //   error: (err) => {
//       //     console.error('Error fetching event for edit:', err);
//       //     alert('Could not load event data.');
//       //     this.router.navigate(['/event-list']);
//       //   }
//       // });
//       this.eventService.getEventById(this.eventId).subscribe({
//   next: (eventData: any) => {

//     let event = eventData.event;

//     event.event_date = event.event_date.substring(0, 10);

//     if (typeof event.event_category === 'string') {
//       try {
//         event.event_category = JSON.parse(event.event_category);
//       } catch {
//         event.event_category = [];
//       }
//     }

//     this.addEventForm.patchValue(event);
//   },
//   error: (err) => {
//     console.error('Error fetching event for edit:', err);
//     alert('Could not load event data.');
//     this.router.navigate(['/event-list']);
//   }
// });
//     }
//   }

//   getFormControl(name: string) {
//     return this.addEventForm.get(name) as FormControl;
//   }

//   isFormControlError(name: string): boolean {
//     const control = this.getFormControl(name);
//     return !!(control?.errors?.['required'] && control?.dirty);
//   }

// //   onSubmit(): void {

// //     if (this.addEventForm.valid) {
// //       if (this.eventId) {
// //         // Update Logic
// //         // this.eventService.updateEvent(this.eventId, this.addEventForm.value, { headers: this.headers }).subscribe({
// //         //   next: (response: any) => {
// //         //     console.log('event updated successfully', response);
// //         //     alert('event updated successfully')
// //         //     this.router.navigate(['/event-list']);
// //         //   },
// //         //   error: (error: any) => {
// //         //     console.error('Error updating event', error);
// //         //   }
// //         // });

// //         // Update Logic
// // this.eventService.updateEvent(this.eventId, this.addEventForm.value, { headers: this.headers }).subscribe({
// //   next: (response: any) => {
// //     console.log('Event updated successfully', response);
// //     alert('Event updated successfully');
// //     this.router.navigate(['/event-list']);
// //   },
// //   error: (error: any) => {
// //     console.error('Error updating event', error);
// //     alert('Failed to update event. ' + (error.error?.message || ''));
// //   }
// // });
// //       } else {
// //         // Add Logic
// //         this.eventService.addEvent(this.addEventForm.value, { headers: this.headers }).subscribe({
// //           next: (response: any) => {
// //             if (response.message) alert(response.message)
// //             console.log('event added successfully', response);

// //             this.router.navigate(['/event-list']);
// //           },
// //           error: (error) => {
// //             if (error.status === 409) {
// //               alert('Event already exists!');
// //             }
// //             else console.error('Error adding event', error);
// //           }
// //         });
// //       }
// //     }
// //   }
// onSubmit(): void {

//   if (this.addEventForm.invalid) {
//     this.addEventForm.markAllAsTouched();
//     return;
//   }

//   const formData: any = {
//     ...this.addEventForm.value
//   };

//   if (formData.event_mode === "Offline") {

//     if (!formData.location) {
//       alert("Location is required for offline events");
//       return;
//     }

//     if (!formData.total_seats || formData.total_seats <= 0) {
//       alert("Total seats must be greater than 0");
//       return;
//     }
//   }

//   if (this.eventId) {

//     this.eventService.updateEvent(
//       this.eventId,
//       formData,
//       { headers: this.headers }
//     ).subscribe({

//       next: (response: any) => {
//         console.log(response);
//         alert("Event updated successfully");
//         this.router.navigate(['/event-list']);
//       },

//       error: (error: any) => {
//         console.error(error);
//         alert(error.error?.message || "Update failed");
//       }

//     });

//   } else {

//     this.eventService.addEvent(
//       formData,
//       { headers: this.headers }
//     ).subscribe({

//       next: (response: any) => {
//         console.log(response);
//         alert(response.message || "Event added successfully");
//         this.router.navigate(['/event-list']);
//       },

//       error: (error: any) => {
//         console.error(error);

//         if (error.status === 409) {
//           alert("Event already exists");
//         } else {
//           alert(error.error?.message || "Add failed");
//         }
//       }

//     });

//   }
// }
// }
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
    timing: new FormControl('', [Validators.required]),

    event_type: new FormControl('', [Validators.required]),

    // User comma separated categories dalega
    event_category: new FormControl('', [Validators.required]),

    event_mode: new FormControl('Online', [Validators.required]),

    location: new FormControl(''),

    total_seats: new FormControl<number | null>(null),
    ticket_price: new FormControl<number>(0, [Validators.required])
  });

  eventId?: any;
  headers: any;
  formTitle: string = 'Add Event';

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Login First');
      this.router.navigate(['']);
      return;
    }

    this.headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.eventId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.eventId) {

      this.formTitle = 'Edit Event';

      this.eventService.getEventById(this.eventId).subscribe({

        next: (eventData: any) => {

          const event = eventData.event;

          event.event_date = event.event_date.substring(0, 10);

          if (typeof event.event_category === 'string') {
            try {

              const categories = JSON.parse(event.event_category);

              event.event_category = categories.join(', ');

            } catch {

              event.event_category = '';

            }
          }

          this.addEventForm.patchValue(event);
        },

        error: (err) => {
          console.error(err);
          alert('Could not load event');
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

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  onSubmit(): void {

    if (this.addEventForm.invalid) {

      this.addEventForm.markAllAsTouched();

      return;
    }

    const formData: any = {
      ...this.addEventForm.value
    };

    // Convert category string -> array
    formData.event_category =
      formData.event_category
        ?.split(',')
        .map((x: string) => x.trim())
        .filter((x: string) => x);

    if (formData.event_mode === 'Offline') {

      if (!formData.location) {

        alert('Location is required');

        return;
      }

      if (
        !formData.total_seats ||
        formData.total_seats <= 0
      ) {

        alert('Total seats must be greater than 0');

        return;
      }

    } else {

      formData.location = null;
      formData.total_seats = null;

    }
    if (
  formData.ticket_price == null ||
  formData.ticket_price < 0
) {
  alert('Ticket price cannot be negative');
  return;
}

    if (this.eventId) {

      this.eventService
        .updateEvent(
          this.eventId,
          formData,
          { headers: this.headers }
        )
        .subscribe({

          next: (response: any) => {

            console.log(response);

            alert('Event updated successfully');

            this.router.navigate(['/event-list']);
          },

          error: (error: any) => {

            console.error(error);

            alert(
              error.error?.message ||
              'Update failed'
            );
          }

        });

    } else {

      this.eventService
        .addEvent(
          formData,
          { headers: this.headers }
        )
        .subscribe({

          next: (response: any) => {

            console.log(response);

            alert(
              response.message ||
              'Event added successfully'
            );

            this.router.navigate(['/event-list']);
          },

          error: (error: any) => {

            console.error(error);

            if (error.status === 409) {

              alert('Event already exists');

            } else {

              alert(
                error.error?.message ||
                'Failed to add event'
              );
            }
          }

        });
    }
  }
}