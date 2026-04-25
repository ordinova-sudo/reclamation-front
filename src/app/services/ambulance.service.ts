import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmbulanceService {
  private apiUrl = 'http://localhost:8087/api/ambulances';

  constructor(private http: HttpClient) { }

  createAmbulance(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllAmbulances(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getAmbulanceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateAmbulance(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteAmbulance(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
