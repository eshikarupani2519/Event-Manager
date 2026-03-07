import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { AttendeesModule } from './attendees/attendees.module';
import { HttpClientModule } from '@angular/common/http';

import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { WebinarModule } from './webinar/webinar.module';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    EventsModule,
    AttendeesModule,
    DashboardModule,
    SharedModule, WebinarModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
