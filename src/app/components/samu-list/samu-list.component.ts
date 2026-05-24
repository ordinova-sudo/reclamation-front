import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SamuService } from '../../services/samu.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

@Component({
  selector: 'app-samu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './samu-list.component.html',
  styleUrl: './samu-list.component.css'
})
export class SamuListComponent implements OnInit {
  samus: any[] = [];
  paginatedSamus: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedGouvernorat: string = '';
  
  // Pagination backend
  currentPage: number = 0;
  itemsPerPage: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = PAGINATION_CONFIG.PAGE_SIZE_OPTIONS;
  Math = Math;

  gouvernorats: string[] = [
    'Tunis','Ariana','Ben Arous','Manouba',
    'Nabeul','Zaghouan','Bizerte','Béja',
    'Jendouba','Le Kef','Siliana','Kairouan',
    'Kasserine','Sidi Bouzid','Sousse','Monastir',
    'Mahdia','Sfax','Gabès','Médenine',
    'Tataouine','Gafsa','Tozeur','Kébili'
  ];

  constructor(
    private samuService: SamuService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSamus();
    } else {
      this.loading = false;
    }
  }

  loadSamus(): void {
    console.log('Chargement des SAMU depuis:', `http://localhost:8087/api/samus?page=${this.currentPage}&size=${this.itemsPerPage}`);
    this.samuService.getAllSamus(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        console.log('Réponse backend SAMU:', response);
        this.samus = response.content;
        this.applyFilters();
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des SAMU:', err);
        console.error('Détails erreur:', err.error);
        console.error('Status:', err.status);
        this.loading = false;
        this.snackBar.open(`Erreur: ${err.status} - ${err.message}`, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  applyFilters(): void {
    this.paginatedSamus = this.samus.filter(samu => {
      const matchesSearch = !this.searchTerm.trim() || 
        samu.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        samu.ville.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesGouvernorat = !this.selectedGouvernorat || 
        samu.gouvernorat === this.selectedGouvernorat;
      
      return matchesSearch && matchesGouvernorat;
    });
  }

  filterSamus(): void {
    this.applyFilters();
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadSamus();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadSamus();
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

  viewSamuDetails(id: number): void {
    this.router.navigate(['/home/samu-details', id]);
  }

  createSamu(): void {
    this.router.navigate(['/home/addSamu']);
  }

  deleteSamu(event: Event, id: number, nom: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le SAMU "${nom}" ?`)) {
      this.samuService.deleteSamu(id).subscribe({
        next: () => {
          this.snackBar.open('SAMU supprimé avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadSamus();
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
