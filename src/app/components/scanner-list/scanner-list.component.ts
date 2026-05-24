import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ScannerService } from '../../services/scanner.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

@Component({
  selector: 'app-scanner-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule],
  templateUrl: './scanner-list.component.html',
  styleUrl: './scanner-list.component.css'
})
export class ScannerListComponent implements OnInit {
  scanners: any[] = [];
  filteredScanners: any[] = [];
  hopitaux: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedEtat: string = '';
  selectedHopital: string = '';
  
  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
  
  etats = ['FONCTIONNEL', 'EN_PANNE', 'MAINTENANCE'];

  constructor(
    private scannerService: ScannerService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadScanners();
    } else {
      this.loading = false;
    }
  }

  loadScanners(): void {
    this.scannerService.getAllScanners(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.scanners = response.content || [];
        this.filteredScanners = this.scanners;
        this.totalPages = response.totalPages || 0;
        this.extractHopitaux();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des scanners', err);
        this.loading = false;
      }
    });
  }

  extractHopitaux(): void {
    const hopitauxMap = new Map();
    this.scanners.forEach(scanner => {
      if (scanner.hopital && scanner.hopital.id) {
        hopitauxMap.set(scanner.hopital.id, scanner.hopital);
      }
    });
    this.hopitaux = Array.from(hopitauxMap.values());
  }

  filterScanners(): void {
    this.filteredScanners = this.scanners.filter(scanner => {
      const matchesSearch = !this.searchTerm.trim() || 
        scanner.modele.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        scanner.marque.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesEtat = !this.selectedEtat || 
        scanner.etat === this.selectedEtat;
      
      const matchesHopital = !this.selectedHopital || 
        (scanner.hopital && scanner.hopital.id.toString() === this.selectedHopital);
      
      return matchesSearch && matchesEtat && matchesHopital;
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadScanners();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadScanners();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadScanners();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  viewScannerDetails(id: number): void {
    this.router.navigate(['/home/scanner-details', id]);
  }

  createScanner(): void {
    this.router.navigate(['/home/addScanner']);
  }

  deleteScanner(event: Event, id: number, modele: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le scanner "${modele}" ?`)) {
      this.scannerService.deleteScanner(id).subscribe({
        next: () => {
          this.snackBar.open('Scanner supprimé avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadScanners();
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
