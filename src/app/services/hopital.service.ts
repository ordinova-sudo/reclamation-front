import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PAGINATION_CONFIG } from '../config/pagination.config';

@Injectable({
  providedIn: 'root'
})
export class HopitalService {
      private apiUrl = 'http://localhost:8087/api/hopitaux'; 


constructor(private http: HttpClient) { }

  createHopital(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllHopitals(page: number = 0, size: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, sortBy: string = PAGINATION_CONFIG.DEFAULT_SORT_BY, sortDir: string = PAGINATION_CONFIG.DEFAULT_SORT_DIR): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllHopitalsNoPagination(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getHopitalById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateHopital(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteHopital(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
