import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LitService } from '../../services/lit.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

@Component({
  selector: 'app-lit-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule],
  templateUrl: './lit-list.component.html',
  styleUrl: './lit-list.component.css'
})
export class LitListComponent implements OnInit {
  lits: any[] = [];
  filteredLits: any[] = [];
  hopitaux: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedEtat: string = '';
  selectedType: string = '';
  selectedHopital: string = '';
  
  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
  
  etats = ['PROPRE', 'SALE', 'EN_MAINTENANCE'];
  types = ['STANDARD', 'REANIMATION', 'URGENCE', 'PEDIATRIQUE', 'MATERNITE', 'CHIRURGICAL', 'LONGUE_DUREE', 'PSYCHIATRIQUE', 'ISOLEMENT', 'SOINS_PALLIATIFS'];

  constructor(
    private litService: LitService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLits();
    } else {
      this.loading = false;
    }
  }

  loadLits(): void {
    this.litService.getAllLits(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.lits = response.content || [];
        this.filteredLits = this.lits;
        this.totalPages = response.totalPages || 0;
        this.extractHopitaux();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des lits', err);
        this.loading = false;
      }
    });
  }

  extractHopitaux(): void {
    const hopitauxMap = new Map();
    this.lits.forEach(lit => {
      if (lit.hopital && lit.hopital.id) {
        hopitauxMap.set(lit.hopital.id, lit.hopital);
      }
    });
    this.hopitaux = Array.from(hopitauxMap.values());
  }

  filterLits(): void {
    this.filteredLits = this.lits.filter(lit => {
      const matchesSearch = !this.searchTerm.trim() || 
        lit.numero.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesEtat = !this.selectedEtat || 
        lit.etat === this.selectedEtat;
      
      const matchesType = !this.selectedType || 
        lit.type === this.selectedType;
      
      const matchesHopital = !this.selectedHopital || 
        (lit.hopital && lit.hopital.id.toString() === this.selectedHopital);
      
      return matchesSearch && matchesEtat && matchesType && matchesHopital;
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadLits();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadLits();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadLits();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  viewLitDetails(id: number): void {
    this.router.navigate(['/home/lit-details', id]);
  }

  createLit(): void {
    this.router.navigate(['/home/addLit']);
  }

  deleteLit(event: Event, id: number, numero: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le lit "${numero}" ?`)) {
      this.litService.deleteLit(id).subscribe({
        next: () => {
          this.snackBar.open('Lit supprimé avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadLits();
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
