import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PAGINATION_CONFIG } from '../config/pagination.config';

@Injectable({
  providedIn: 'root'
})
export class LitService {
  private apiUrl = 'http://localhost:8087/api/lits';

  constructor(private http: HttpClient) { }

  createLit(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllLits(page: number = 0, size: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, sortBy: string = PAGINATION_CONFIG.DEFAULT_SORT_BY, sortDir: string = PAGINATION_CONFIG.DEFAULT_SORT_DIR): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllLitsNoPagination(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
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
