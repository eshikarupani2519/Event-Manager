import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AttendeesService {
baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }
   getAllEvents(headers:any){
    return this.http.get(`${this.baseUrl}/events`,headers)
  }
   registerAttendee(attendeeData: any,headers:any){
    return this.http.post(`${this.baseUrl}/attendees`, attendeeData,  {headers} );
  }

  // GET: get attendees by event ID
  getAttendeeByEventId(eventId: string,headers:any) {
   
    return this.http.get(`${this.baseUrl}/attendees/${eventId}`, { headers} );
  }
}
