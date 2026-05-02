import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { VisiteurService } from '../../services/visiteur.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-visiteur-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule],
  templateUrl: './visiteur-list.component.html',
  styleUrl: './visiteur-list.component.css'
})
export class VisiteurListComponent implements OnInit {
  visiteurs: any[] = [];
  filteredVisiteurs: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  selectedStatus: string = '';

  constructor(
    private visiteurService: VisiteurService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadVisiteurs();
    } else {
      this.loading = false;
    }
  }

  loadVisiteurs(): void {
    this.visiteurService.getAllVisiteurs().subscribe({
      next: (data) => {
        this.visiteurs = data;
        this.filteredVisiteurs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des visiteurs', err);
        this.loading = false;
      }
    });
  }

  filterVisiteurs(): void {
    this.filteredVisiteurs = this.visiteurs.filter(visiteur => {
      const matchesSearch = !this.searchTerm.trim() ||
        visiteur.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        visiteur.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        visiteur.email?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus ||
        (this.selectedStatus === 'active' && visiteur.enabled) ||
        (this.selectedStatus === 'inactive' && !visiteur.enabled);
      
      return matchesSearch && matchesStatus;
    });
  }

  toggleStatus(event: Event, visiteur: any): void {
    event.stopPropagation();
    
    this.visiteurService.toggleEnabled(visiteur.id).subscribe({
      next: () => {
        visiteur.enabled = !visiteur.enabled;
        const status = visiteur.enabled ? 'activé' : 'désactivé';
        this.snackBar.open(`Compte ${status} avec succès ✓`, 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut', err);
        this.snackBar.open('Erreur lors du changement de statut ❌', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
