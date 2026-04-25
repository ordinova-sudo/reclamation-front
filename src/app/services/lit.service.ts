import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LitService {
  private apiUrl = 'http://localhost:8087/api/lits';

  constructor(private http: HttpClient) { }

  createLit(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllLits(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getLitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateLit(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteLit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
