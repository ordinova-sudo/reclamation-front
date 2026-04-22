import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentHospitaliseService {
  private apiUrl = 'http://localhost:8087/api/agents'; 

  constructor(private http: HttpClient) { }

  createAgent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllAgents(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getAgentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateAgent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
