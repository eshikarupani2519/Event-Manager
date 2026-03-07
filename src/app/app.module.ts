import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { AttendeesModule } from './attendees/attendees.module';


import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { WebinarModule } from './webinar/webinar.module';

@NgModule({
  declarations: [
    AppComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    EventsModule,
    AttendeesModule,
    DashboardModule,
    SharedModule, WebinarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
