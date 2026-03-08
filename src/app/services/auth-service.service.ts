import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8087/api/v1/auth'; 

  constructor(private http: HttpClient) { }

  signUp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  signIn(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, data);
  }
  }

