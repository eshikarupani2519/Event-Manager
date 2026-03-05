import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterAttendeeComponent } from './register-attendee/register-attendee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttendeesListComponent } from './attendees-list/attendees-list.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    RegisterAttendeeComponent,
    AttendeesListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class AttendeesModule { }
