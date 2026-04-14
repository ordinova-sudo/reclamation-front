import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HopitalService } from '../../services/hopital.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hopital-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './hopital-list.component.html',
  styleUrl: './hopital-list.component.css'
})
export class HopitalListComponent implements OnInit {
  hopitals: any[] = [];
  filteredHopitals: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';

  constructor(
    private hopitalService: HopitalService,
    private router: Router,
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
    this.hopitalService.getAllHopitals().subscribe({
      next: (data) => {
        this.hopitals = data;
        this.filteredHopitals = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôpitaux', err);
        this.loading = false;
      }
    });
  }

  filterHopitals(): void {
    if (!this.searchTerm.trim()) {
      this.filteredHopitals = this.hopitals;
    } else {
      this.filteredHopitals = this.hopitals.filter(hopital =>
        hopital.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  viewHopitalDetails(id: number): void {
    this.router.navigate(['/home/hopital-details', id]);
  }

  createHopital(): void {
    this.router.navigate(['/home/addHopital']);
  }
}
