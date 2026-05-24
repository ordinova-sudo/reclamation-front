import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PAGINATION_CONFIG } from '../config/pagination.config';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8087/api/reclamations';

  constructor(private http: HttpClient) { }

  getAllReclamations(page: number = 0, size: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, sortBy: string = PAGINATION_CONFIG.DEFAULT_SORT_BY, sortDir: string = PAGINATION_CONFIG.DEFAULT_SORT_DIR, typeCible?: string): Observable<any> {
    let url = `${this.apiUrl}/ordered?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    if (typeCible) {
      url += `&typeCible=${typeCible}`;
    }
    return this.http.get(url);
  }

  getAllReclamationsOnly(page: number = 0, size: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, sortBy: string = PAGINATION_CONFIG.DEFAULT_SORT_BY, sortDir: string = PAGINATION_CONFIG.DEFAULT_SORT_DIR): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllPannesTechniques(page: number = 0, size: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE, sortBy: string = PAGINATION_CONFIG.DEFAULT_SORT_BY, sortDir: string = PAGINATION_CONFIG.DEFAULT_SORT_DIR): Observable<any> {
    return this.http.get(`${this.apiUrl}/pannes-techniques?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getAllReclamationsNoPagination(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
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
