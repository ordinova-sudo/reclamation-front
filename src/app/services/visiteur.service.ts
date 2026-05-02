import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisiteurService {
  private baseUrl = 'http://localhost:8087/api/users';

  constructor(private http: HttpClient) { }

  getAllVisiteurs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/visiteurs`);
  }

  getVisiteurById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visiteurs/${id}`);
  }

  toggleEnabled(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/toggle-enabled`, {});
  }
}
