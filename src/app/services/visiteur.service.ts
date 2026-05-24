import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PAGINATION_CONFIG } from '../config/pagination.config';

@Injectable({
  providedIn: 'root'
})
export class VisiteurService {
  private baseUrl = 'http://localhost:8087/api/users';

  constructor(private http: HttpClient) { }

  getAllVisiteurs(page: number = 0, size: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, sortBy: string = PAGINATION_CONFIG.DEFAULT_SORT_BY, sortDir: string = PAGINATION_CONFIG.DEFAULT_SORT_DIR): Observable<any> {
    return this.http.get(`${this.baseUrl}/visiteurs?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllVisiteursNoPagination(): Observable<any> {
    return this.http.get(`${this.baseUrl}/visiteurs/all`);
  }

  getVisiteurById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visiteurs/${id}`);
  }

  toggleEnabled(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/toggle-enabled`, {});
  }
}
