import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PAGINATION_CONFIG } from '../config/pagination.config';

@Injectable({
  providedIn: 'root'
})
export class AmbulanceService {
  private apiUrl = 'http://localhost:8087/api/ambulances';

  constructor(private http: HttpClient) { }

  createAmbulance(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllAmbulances(page: number = 0, size: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, sortBy: string = PAGINATION_CONFIG.DEFAULT_SORT_BY, sortDir: string = PAGINATION_CONFIG.DEFAULT_SORT_DIR): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllAmbulancesNoPagination(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
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
