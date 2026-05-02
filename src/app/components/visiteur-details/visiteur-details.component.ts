import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisiteurService } from '../../services/visiteur.service';

@Component({
  selector: 'app-visiteur-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './visiteur-details.component.html',
  styleUrl: './visiteur-details.component.css'
})
export class VisiteurDetailsComponent implements OnInit {
  visiteur: any = null;
  visiteurId!: number;
  loading: boolean = true;

  constructor(
    private visiteurService: VisiteurService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.visiteurId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadVisiteurDetails();
    }
  }

  loadVisiteurDetails(): void {
    this.visiteurService.getVisiteurById(this.visiteurId).subscribe({
      next: (data) => {
        this.visiteur = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/visiteur-list']);
  }
}
