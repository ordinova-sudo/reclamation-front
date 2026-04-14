import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HopitalService {
      private apiUrl = 'http://localhost:8087/api/hopitaux'; 


constructor(private http: HttpClient) { }

  createHopital(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllHopitals(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getHopitalById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateHopital(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
