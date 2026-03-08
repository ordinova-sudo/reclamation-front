import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';


@Injectable({
  providedIn: 'root'
})
export class CategorieService {
    private apiUrl = 'http://localhost:8087/api/v1/product-categories'; 

  constructor(private http: HttpClient) { }

  ajouterCategorie(data: any): Observable<any> {

    return this.http.post(`${this.apiUrl}`, data);
  }
   getAllCategorie(): Observable<Category[]> {

    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  
  }

