import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AddEventComponent } from './events/add-event/add-event.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { SingleEventComponent } from './events/single-event/single-event.component';
import { RegisterAttendeeComponent } from './attendees/register-attendee/register-attendee.component';
import { AttendeesListComponent } from './attendees/attendees-list/attendees-list.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SuggestionsComponent } from './events/suggestions/suggestions.component';
import { ScheduleWebinarComponent } from './webinar/schedule-webinar/schedule-webinar.component';
import { WebinarListComponent } from './webinar/webinar-list/webinar-list.component';
import { WebinarMeetingComponent } from './webinar/webinar-meeting/webinar-meeting.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'add-event',component:AddEventComponent},
  {path:'update-event/:id',component:AddEventComponent},
  {path:'event-list',component:EventListComponent},
  {path:'event/:id',component:SingleEventComponent},
  {path:'register-attendee',component:RegisterAttendeeComponent},
  {path:'attendees-list',component:AttendeesListComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'event-suggestions',component:SuggestionsComponent},
  { path:'schedule-webinar', component: ScheduleWebinarComponent },

{ path:'webinars', component: WebinarListComponent },

{ path:'webinar/:id', component: WebinarMeetingComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
