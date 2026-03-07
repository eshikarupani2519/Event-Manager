// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class WebinarService {

// //   api = "http://localhost:5000/api/events";

// //   constructor(private http: HttpClient) {}

// //   scheduleWebinar(data:any){
// //     return this.http.post(this.api,data)
// //   }

// //   getWebinars(){
// //     return this.http.get(this.api)
// //   }

// // }

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebinarService {

//   constructor(private http: HttpClient) {}

//   scheduleWebinar(webinar:any){

//     const token = localStorage.getItem("token");

//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`
//     });

//     return this.http.post(
//       "http://localhost:5000/api/events",
//       webinar,
//       { headers }
//     );
//   }

// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebinarService {

  constructor(private http: HttpClient) {}

  scheduleWebinar(webinar:any){

    const token = localStorage.getItem("token")

    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    })

    return this.http.post(
      "http://localhost:5000/api/events",
      webinar,
      {headers}
    )
  }

  getWebinars(){

    const token = localStorage.getItem("token")

    const headers = new HttpHeaders({
      Authorization:`Bearer ${token}`
    })

    return this.http.get(
      "http://localhost:5000/api/events",
      {headers}
    )

  }

}