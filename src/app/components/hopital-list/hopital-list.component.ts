import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HopitalService } from '../../services/hopital.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

@Component({
  selector: 'app-hopital-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule],
  templateUrl: './hopital-list.component.html',
  styleUrl: './hopital-list.component.css'
})
export class HopitalListComponent implements OnInit {
  hopitals: any[] = [];
  filteredHopitals: any[] = [];
  paginatedHopitals: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedType: string = '';
  selectedGouvernorat: string = '';
  
  // Pagination backend
  currentPage: number = 0;
  itemsPerPage: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = PAGINATION_CONFIG.PAGE_SIZE_OPTIONS;
  Math = Math;

  typesHopital = [
    { value: 'UNIVERSITAIRE', label: 'Universitaire' },
    { value: 'MILITAIRE', label: 'Militaire' },
    { value: 'REGIONAL', label: 'Régional' },
    { value: 'DISTRICT', label: 'District' }
  ];

  gouvernorats: string[] = [
    'Tunis','Ariana','Ben Arous','Manouba',
    'Nabeul','Zaghouan','Bizerte','Béja',
    'Jendouba','Le Kef','Siliana','Kairouan',
    'Kasserine','Sidi Bouzid','Sousse','Monastir',
    'Mahdia','Sfax','Gabès','Médenine',
    'Tataouine','Gafsa','Tozeur','Kébili'
  ];

  constructor(
    private hopitalService: HopitalService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadHopitals();
    } else {
      this.loading = false;
    }
  }

  loadHopitals(): void {
    this.hopitalService.getAllHopitals(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.hopitals = response.content;
        this.applyFilters();
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôpitaux', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.paginatedHopitals = this.hopitals.filter(hopital => {
      const matchesSearch = !this.searchTerm.trim() || 
        hopital.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.selectedType || 
        hopital.type === this.selectedType;
      
      const matchesGouvernorat = !this.selectedGouvernorat || 
        hopital.gouvernorat === this.selectedGouvernorat;
      
      return matchesSearch && matchesType && matchesGouvernorat;
    });
  }

  filterHopitals(): void {
    this.applyFilters();
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadHopitals();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadHopitals();
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

  viewHopitalDetails(id: number): void {
    this.router.navigate(['/home/hopital-details', id]);
  }

  createHopital(): void {
    this.router.navigate(['/home/addHopital']);
  }

  deleteHopital(event: Event, id: number, nom: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'hôpital "${nom}" ?`)) {
      this.hopitalService.deleteHopital(id).subscribe({
        next: () => {
          this.snackBar.open('Hôpital supprimé avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadHopitals();
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
