import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }
   getStats(headers:any) {
    return this.http.get(`${this.baseUrl}/dashboard`,headers);
  }
}
