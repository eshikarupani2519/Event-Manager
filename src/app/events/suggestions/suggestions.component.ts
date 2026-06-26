// import { Component } from '@angular/core';
// import { EventService } from '../event.service';
// import { HttpHeaders } from '@angular/common/http';
//  import { forkJoin } from 'rxjs';

// @Component({
//   selector: 'app-suggestions',
//   templateUrl: './suggestions.component.html',
//   styleUrls: ['./suggestions.component.css']
// })
// export class SuggestionsComponent {

//   events:any[]=[];
//   loading=false;

//   constructor(private eventService:EventService){}

//   loadSuggestions(){

   


//   this.loading = true;
//   const token = localStorage.getItem('token');
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${token}`
//   });

//   // Run both API calls together
//   forkJoin({
//     attendee: this.eventService.getAttendeeById(),
//     events: this.eventService.getAllEvents({ headers })
//   }).subscribe({
//     next: ({ attendee, events }) => {
//       const payload = {
//         attendee,
//         event: events
//       };
//       console.log("Final payload:", payload);

//       // Now call event suggestions only after both are ready
//       this.eventService.getEventSuggestions(headers, payload).subscribe({
//         next: (res:any) => {
//           console.log("Suggestions:", res);
//           this.events = res;
//           this.loading = false;
//         },
//         error: (err:any) => {
//           console.error("Suggestion error:", err);
//           this.loading = false;
//         }
//       });
//     },
//     error: (err:any) => {
//       console.error("Attendee/Events error:", err);
//       this.loading = false;
//     }
//   });
// }


//     this.loading=true;
// // replace this by actual logged in person's data later
//     let payload={
//       attendee:{
//         id:1,
//         name:"Eshika Rupani",
//         interests:["AI","Machine Learning","Cloud"]
//       },
//       event:[]
//     }
//     const token = localStorage.getItem('token');
//     console.log(token);
//    let headers = new HttpHeaders({
//           'Authorization': `Bearer ${token}`
//         });
//     this.eventService.getAttendeeById().subscribe({
//       next:(res:any)=>{
//         console.log("attendee:",res);
//         payload.attendee=res;
//       }
//     })
//     this.eventService.getAllEvents({headers:headers}).subscribe({
//       next:(res:any)=>{
//         payload.event=res;
//         console.log(res);
//         console.log(payload)
//          this.eventService.getEventSuggestions(headers,payload)
//       .subscribe({
//         next:(res:any)=>{
          
//           console.log(res);
//         this.events=res;
//         this.loading=false;
//         },
//         error:(err:any)=>{
//           console.log(err);
//         }
//       });

//       },
//       error:(err:any)=>{
//         console.log(err)
//       }
//     })
   

//   }
// }
import { Component } from '@angular/core';
import { EventService } from '../event.service';
import { HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent {

  events: any[] = [];
  loading = false;

  constructor(private eventService: EventService) {}

  loadSuggestions() {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Run both API calls together
    forkJoin({
      attendee: this.eventService.getAttendeeById({ headers }),
      events: this.eventService.getAllEvents({ headers })
    }).subscribe({
      next: ({ attendee, events }) => {
        const payload = {
          attendee,
          event: events
        };
        console.log("Final payload:", payload);

        // Now call event suggestions only after both are ready
        this.eventService.getEventSuggestions(headers,payload).subscribe({
          next: (res: any) => {
            console.log("Suggestions:", res);
            this.events = res;
            this.loading = false;
          },
          error: (err: any) => {
            console.error("Suggestion error:", err);
            this.loading = false;
          }
        });
      },
      error: (err: any) => {
        console.error("Attendee/Events error:", err);
        this.loading = false;
      }
    });
  }
}
