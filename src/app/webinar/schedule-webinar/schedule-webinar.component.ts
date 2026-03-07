// import { Component } from '@angular/core';
// import { WebinarService } from '../webinar.service';

// @Component({
//   selector: 'app-schedule-webinar',
//   templateUrl: './schedule-webinar.component.html'
// })
// export class ScheduleWebinarComponent {

//   webinar:any={
//     event_name:'',
//     event_date:'',
//     timing:'',
//     event_mode:'Online'
//   }

//   constructor(private webinarService:WebinarService){}

//   schedule(){

//     this.webinarService.scheduleWebinar(this.webinar)
//     .subscribe(res=>{
//       alert("Webinar Scheduled Successfully")
//     })

//   }

// }
import { Component } from '@angular/core';
import { WebinarService } from '../webinar.service';

@Component({
  selector: 'app-schedule-webinar',
  templateUrl: './schedule-webinar.component.html'
})
export class ScheduleWebinarComponent {

  webinar:any={
    event_name:'',
    event_date:'',
    timing:'',
    event_mode:'Online'
  }

  constructor(private webinarService:WebinarService){}

  schedule(){

    const token = localStorage.getItem("token")

    this.webinarService.scheduleWebinar(this.webinar, token)
    .subscribe({
      next:(res:any)=>{
        alert("Webinar Scheduled Successfully")
      },
      error:(err)=>{
        console.log(err)
        alert("Error scheduling webinar")
      }
    })

  }

}