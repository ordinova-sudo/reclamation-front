import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private apiUrl = 'http://localhost:8087/api/scanners';

  constructor(private http: HttpClient) { }

  createScanner(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllScanners(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getScannerById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateScanner(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteScanner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
