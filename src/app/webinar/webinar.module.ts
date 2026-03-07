// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ScheduleWebinarComponent } from './schedule-webinar/schedule-webinar.component';
// import { WebinarListComponent } from './webinar-list/webinar-list.component';
// import { WebinarMeetingComponent } from './webinar-meeting/webinar-meeting.component';



// @NgModule({
//   declarations: [
//     ScheduleWebinarComponent,
//     WebinarListComponent,
//     WebinarMeetingComponent
//   ],
//   imports: [
//     CommonModule
//   ]
// })
// export class WebinarModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ScheduleWebinarComponent } from './schedule-webinar/schedule-webinar.component';
import { WebinarListComponent } from './webinar-list/webinar-list.component';
import { WebinarMeetingComponent } from './webinar-meeting/webinar-meeting.component';

@NgModule({
  declarations: [
    ScheduleWebinarComponent,
    WebinarListComponent,
    WebinarMeetingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class WebinarModule { }