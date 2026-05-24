import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

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
  paginatedReclamations: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';
  
  types = ['AMBULANCE', 'SCANNER', 'LIT'];
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
      this.loadReclamations();
    } else {
      this.loading = false;
    }
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamationsOnly(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        console.log('Réponse backend réclamations:', response);
        this.paginatedReclamations = response.content || [];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.currentPage = response.number || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réclamations', err);
        this.loading = false;
      }
    });
  }

  filterReclamations(): void {
    this.currentPage = 0;
    this.loadReclamations();
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadReclamations();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadReclamations();
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
