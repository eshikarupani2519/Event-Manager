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

    this.webinarService.scheduleWebinar(this.webinar)
    .subscribe(res=>{
      alert("Webinar Scheduled Successfully")
    })

  }

}