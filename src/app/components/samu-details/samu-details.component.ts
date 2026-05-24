import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SamuService } from '../../services/samu.service';
import { HopitalService } from '../../services/hopital.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-samu-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './samu-details.component.html',
  styleUrl: './samu-details.component.css'
})
export class SamuDetailsComponent implements OnInit {
  samuId: number | null = null;
  loading: boolean = true;
  editMode: boolean = false;
  hopitals: any[] = [];

  samuForm = new FormGroup({
    nom: new FormControl('', Validators.required),
    gouvernorat: new FormControl('', Validators.required),
    ville: new FormControl('', Validators.required),
    adresse: new FormControl(''),
    latitude: new FormControl(null),
    longitude: new FormControl(null),
    telephone: new FormControl('', Validators.required),
    email: new FormControl(''),
    hopitalId: new FormControl(null, Validators.required)
  });

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
    private hopitalService: HopitalService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.samuId = +id;
        this.loadHopitals();
        this.loadSamuDetails(this.samuId);
      }
    } else {
      this.loading = false;
    }
  }

  loadHopitals(): void {
    this.hopitalService.getAllHopitalsNoPagination().subscribe({
      next: (data) => {
        this.hopitals = data;
      },
      error: (err) => console.error('Erreur chargement hôpitaux', err)
    });
  }

  loadSamuDetails(id: number): void {
    this.samuService.getSamuById(id).subscribe({
      next: (data) => {
        this.samuForm.patchValue({
          ...data,
          hopitalId: data.hopital?.id
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails', err);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des détails', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.samuId) {
      this.loadSamuDetails(this.samuId);
    }
  }

  onSubmit(): void {
    if (this.samuForm.valid && this.samuId) {
      const formData = {
        ...this.samuForm.value,
        hopital: { id: this.samuForm.value.hopitalId }
      };
      
      this.samuService.updateSamu(this.samuId, formData).subscribe({
        next: () => {
          this.snackBar.open('SAMU modifié avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.editMode = false;
          this.loadSamuDetails(this.samuId!);
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la modification ❌', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home/samu-list']);
  }

  getHopitalName(): string {
    const hopitalId = this.samuForm.get('hopitalId')?.value;
    const hopital = this.hopitals.find(h => h.id === hopitalId);
    return hopital?.nom || '-';
  }
}
