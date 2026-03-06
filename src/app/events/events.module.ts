import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEventComponent } from './add-event/add-event.component';
import { EventListComponent } from './event-list/event-list.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsComponent } from './suggestions/suggestions.component';



@NgModule({
  declarations: [
    AddEventComponent,
    EventListComponent,
    SingleEventComponent,
    SuggestionsComponent
  ],
  imports: [
    CommonModule,ReactiveFormsModule,FormsModule,SharedModule
  ]
})
export class EventsModule { }
