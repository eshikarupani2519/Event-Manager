import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AttendeesService } from '../attendees.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-register-attendee',
  templateUrl: './register-attendee.component.html',
  styleUrls: ['./register-attendee.component.css']
})
export class RegisterAttendeeComponent {
    events?: any;
    isLoading:boolean=false;
    headers:any;
constructor(private router: Router,private http:HttpClient,private attendeeService:AttendeesService) { }

  registerFormGroup= new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone:new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    event:new FormControl('', [Validators.required])
  })
ngOnInit(){
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
  getFormControl(name: string) {
    return this.registerFormGroup.get(name)
  }
  isFormControlError(name: string) {
    return this.registerFormGroup.get(name)?.invalid && this.registerFormGroup.get(name)?.dirty
  }
  isEmailValid(email: string) {
    return this.registerFormGroup.get(email)?.invalid && this.registerFormGroup.get(email)?.touched
  }
  isEmailRequired(name: string) {
    return this.registerFormGroup.get(name)?.touched && this.registerFormGroup.get(name)?.errors?.['required']
  }

// submitData() {
//   if (this.registerFormGroup.invalid) return;

//   const { name,phone, email, event } = this.registerFormGroup.value;

//   this.attendeeService.registerAttendee(this.registerFormGroup.value,this.headers).subscribe({
//       next: (res) => {
//         console.log('Attendee registered successfully', res);
//         alert('Attendee registered successfully');
//       },
//       error: (err) => {
//         console.error('Error registering attendee', err);
//       }
//     });
// }

submitData() {

  if (this.registerFormGroup.invalid) return;

  const { name, phone, email, event } = this.registerFormGroup.value;

  const options: any = {
    key: environment.razorpayKey, 
    amount: 500 * 100, 
    currency: "INR",
    name: "Event Registration",
    description: "Event Ticket",

    handler: (response: any) => {

      console.log("Payment successful:", response);

      // After payment success register attendee
      this.attendeeService.registerAttendee(
        this.registerFormGroup.value,
        this.headers
      ).subscribe({
        next: (res) => {
          console.log("Attendee registered", res);
          alert("Payment successful & attendee registered!");
        },
        error: (err) => {
          console.error("Error registering attendee", err);
        }
      });

    },

    prefill: {
      name: name,
      email: email,
      contact: phone
    },

    theme: {
      color: "#3399cc"
    }

  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();

}

}
