// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class RazorpayService {

//   constructor(private http: HttpClient) { }

//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token'); // or sessionStorage if you store it there
//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`
//     });
//   }

//   createOrder(eventId: number, attendeeId: number, seats: number): Observable<any> {
//     const headers = this.getAuthHeaders();
//     return this.http.post('/api/payment/create', {
//       event_id: eventId,
//       attendee_id: attendeeId,
//       seats_to_book: seats
//     }, { headers });
//   }

//   verifyPayment(paymentData: any): Observable<any> {
//     const headers = this.getAuthHeaders();
//     return this.http.post('/api/payment/verify', paymentData, { headers });
//   }
// }