import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HopitalReclamationDTO {
  hopitalId: number;
  nomHopital: string;
  nombreReclamations: number;
}

export interface LitReclamationDTO {
  litId: number;
  numeroLit: string;
  nombreReclamations: number;
}

export interface ScannerReclamationDTO {
  scannerId: number;
  nomScanner: string;
  nombreReclamations: number;
}

export interface AmbulanceReclamationDTO {
  ambulanceId: number;
  immatriculation: string;
  nombreReclamations: number;
}

export interface UserReclamationDTO {
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  nombreReclamations: number;
}

export interface DashboardStatsDTO {
  nombreAgentsHospitalises: number;
  nombreLitsTotal: number;
  nombreLitsDisponibles: number;
  nombreLitsNonDisponibles: number;
  nombreReclamationsTotal: number;
  nombreVisiteursTotal: number;
  nombreUsersNonAcceptes: number;
  nombreReclamationsAmbulances: number;
  nombreReclamationsLits: number;
  nombreReclamationsScanners: number;
  nombreReclamationsPannesTechniques: number;
  top4Hopitaux: HopitalReclamationDTO[];
  litPlusReclame: LitReclamationDTO;
  scannerPlusReclame: ScannerReclamationDTO;
  ambulancePlusReclamee: AmbulanceReclamationDTO;
  top4Users: UserReclamationDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8087/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(`${this.apiUrl}/stats`);
  }
}
