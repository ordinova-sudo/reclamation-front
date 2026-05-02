import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule],
  templateUrl: './reclamation-list.component.html',
  styleUrl: './reclamation-list.component.css'
})
export class ReclamationListComponent implements OnInit {
  reclamations: any[] = [];
  filteredReclamations: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  
  types = ['AMBULANCE', 'SCANNER', 'LIT'];
  statuses = ['NON_TRAITE', 'EN_COURS', 'TRAITE', 'ANNULE'];

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadReclamations();
    } else {
      this.loading = false;
    }
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.filteredReclamations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réclamations', err);
        this.loading = false;
      }
    });
  }

  filterReclamations(): void {
    this.filteredReclamations = this.reclamations.filter(reclamation => {
      const matchesSearch = !this.searchTerm.trim() || 
        reclamation.sujet.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reclamation.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.selectedType || 
        reclamation.typeCible === this.selectedType;
      
      const matchesStatus = !this.selectedStatus || 
        reclamation.statut === this.selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  viewReclamationDetails(id: number): void {
    this.router.navigate(['/home/reclamation-details', id]);
  }

  createReclamation(): void {
    this.router.navigate(['/home/addReclamation']);
  }

  deleteReclamation(event: Event, id: number, sujet: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer la réclamation "${sujet}" ?`)) {
      this.reclamationService.deleteReclamation(id).subscribe({
        next: () => {
          this.snackBar.open('Réclamation supprimée avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadReclamations();
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

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
