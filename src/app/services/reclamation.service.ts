import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8087/api/reclamations';

  constructor(private http: HttpClient) { }

  getAllReclamations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ordered`);
  }

  getReclamationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createReclamation(reclamation: any): Observable<any> {
    return this.http.post(this.apiUrl, reclamation);
  }

  updateReclamation(id: number, reclamation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, reclamation);
  }

  deleteReclamation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
