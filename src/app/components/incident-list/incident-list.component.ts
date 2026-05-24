import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.css'
})
export class IncidentListComponent implements OnInit {
  incidents: any[] = [];
  filteredIncidents: any[] = [];
  paginatedIncidents: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedStatus: string = '';
  
  statuses = ['NON_TRAITE', 'EN_COURS', 'TRAITE', 'ANNULE'];

  // Pagination backend
  currentPage: number = 0;
  itemsPerPage: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = PAGINATION_CONFIG.PAGE_SIZE_OPTIONS;
  Math = Math;

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadIncidents();
    } else {
      this.loading = false;
    }
  }

  loadIncidents(): void {
    this.reclamationService.getAllPannesTechniques(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        console.log('Réponse backend pannes techniques:', response);
        this.paginatedIncidents = response.content || [];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.currentPage = response.number || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des pannes techniques', err);
        this.loading = false;
      }
    });
  }

  filterIncidents(): void {
    this.currentPage = 0;
    this.loadIncidents();
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadIncidents();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadIncidents();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  viewIncidentDetails(id: number): void {
    this.router.navigate(['/home/incident-details', id]);
  }

  createIncident(): void {
    this.router.navigate(['/home/addIncident']);
  }

  deleteIncident(event: Event, id: number, sujet: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer la panne technique "${sujet}" ?`)) {
      this.reclamationService.deleteReclamation(id).subscribe({
        next: () => {
          this.snackBar.open('Panne technique supprimée avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadIncidents();
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
