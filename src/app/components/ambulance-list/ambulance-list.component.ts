import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AmbulanceService } from '../../services/ambulance.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ambulance-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule],
  templateUrl: './ambulance-list.component.html',
  styleUrl: './ambulance-list.component.css'
})
export class AmbulanceListComponent implements OnInit {
  ambulances: any[] = [];
  filteredAmbulances: any[] = [];
  hopitaux: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedType: string = '';
  selectedHopital: string = '';
  
  types = ['MEDICALISEE', 'TRANSPORT_SIMPLE'];

  constructor(
    private ambulanceService: AmbulanceService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAmbulances();
    } else {
      this.loading = false;
    }
  }

  loadAmbulances(): void {
    this.ambulanceService.getAllAmbulances().subscribe({
      next: (data) => {
        this.ambulances = data;
        this.filteredAmbulances = data;
        this.extractHopitaux();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des ambulances', err);
        this.loading = false;
      }
    });
  }

  extractHopitaux(): void {
    const hopitauxMap = new Map();
    this.ambulances.forEach(ambulance => {
      if (ambulance.hopital && ambulance.hopital.id) {
        hopitauxMap.set(ambulance.hopital.id, ambulance.hopital);
      }
    });
    this.hopitaux = Array.from(hopitauxMap.values());
  }

  filterAmbulances(): void {
    this.filteredAmbulances = this.ambulances.filter(ambulance => {
      const matchesSearch = !this.searchTerm.trim() || 
        ambulance.matricule.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.selectedType || 
        ambulance.type === this.selectedType;
      
      const matchesHopital = !this.selectedHopital || 
        (ambulance.hopital && ambulance.hopital.id.toString() === this.selectedHopital);
      
      return matchesSearch && matchesType && matchesHopital;
    });
  }

  viewAmbulanceDetails(id: number): void {
    this.router.navigate(['/home/ambulance-details', id]);
  }

  createAmbulance(): void {
    this.router.navigate(['/home/addAmbulance']);
  }

  deleteAmbulance(event: Event, id: number, matricule: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'ambulance "${matricule}" ?`)) {
      this.ambulanceService.deleteAmbulance(id).subscribe({
        next: () => {
          this.snackBar.open('Ambulance supprimée avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadAmbulances();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.snackBar.open('Erreur lors de la suppression ❌', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
