import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  mlUrl=environment.mlUrl
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }
  getEventById(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/event/${id}`, { headers });
  }

  updateEvent(id: number, formData: any, headers: any) {
    return this.http.put(`${this.baseUrl}/event/${id}`, formData, headers);
  }

  addEvent(event: any, headers: any) {
    return this.http.post(`${this.baseUrl}/events`, event, headers);
  }

  getAllEvents(headers: any) {
    return this.http.get(`${this.baseUrl}/events`, headers)
  }
  deleteEvent(id: number, headers: any) {
    return this.http.delete(`${this.baseUrl}/event/${id}`, headers)
  }
   getEventSuggestions(headers:any,payload:any){
    return this.http.post(`${this.mlUrl}/event-suggestion`,payload,
    {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  getAttendeeById(){
    return this.http.get(`${this.baseUrl}/attendee`);
  }
  getSummary(eventId:any){
    return this.http.get(`${this.baseUrl}/event-summary/${eventId}`)
  }
  checkInAttendee(eventId: string, name: string) {
  return this.http.post('http://127.0.0.1:5001/checkin', {
    event_id: eventId,
    name: name
  });
}

}
