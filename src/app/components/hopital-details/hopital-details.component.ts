import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HopitalService } from '../../services/hopital.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hopital-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './hopital-details.component.html',
  styleUrl: './hopital-details.component.css'
})
export class HopitalDetailsComponent implements OnInit {
  hopitalId: number | null = null;
  loading: boolean = true;
  editMode: boolean = false;

  hopitalForm = new FormGroup({
    nom: new FormControl('', Validators.required),
    gouvernorat: new FormControl('', Validators.required),
    ville: new FormControl(''),
    adresse: new FormControl(''),
    latitude: new FormControl(null),
    longitude: new FormControl(null),
    telephone: new FormControl(''),
    email: new FormControl(''),
    siteWeb: new FormControl(''),
    type: new FormControl('', Validators.required),
    urgence: new FormControl(false),
    heureOuverture: new FormControl(''),
    heureFermeture: new FormControl(''),
    description: new FormControl('')
  });

  gouvernorats: string[] = [
    'Tunis','Ariana','Ben Arous','Manouba',
    'Nabeul','Zaghouan','Bizerte','Béja',
    'Jendouba','Le Kef','Siliana','Kairouan',
    'Kasserine','Sidi Bouzid','Sousse','Monastir',
    'Mahdia','Sfax','Gabès','Médenine',
    'Tataouine','Gafsa','Tozeur','Kébili'
  ];

  typesHopital = [
    { value: 'UNIVERSITAIRE', label: 'Universitaire' },
    { value: 'MILITAIRE', label: 'Militaire' },
    { value: 'REGIONAL', label: 'Régional' },
    { value: 'DISTRICT', label: 'District' }
  ];

  constructor(
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
        this.hopitalId = +id;
        this.loadHopitalDetails(this.hopitalId);
      }
    } else {
      this.loading = false;
    }
  }

  loadHopitalDetails(id: number): void {
    this.hopitalService.getHopitalById(id).subscribe({
      next: (data) => {
        console.log('Données hôpital reçues:', data); // Debug
        this.hopitalForm.patchValue(data);
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
    if (!this.editMode && this.hopitalId) {
      // Recharger les données si on annule l'édition
      this.loadHopitalDetails(this.hopitalId);
    }
  }

  onSubmit(): void {
    if (this.hopitalForm.valid && this.hopitalId) {
      this.hopitalService.updateHopital(this.hopitalId, this.hopitalForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Hôpital modifié avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.editMode = false;
          this.loadHopitalDetails(this.hopitalId!);
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
    this.router.navigate(['/home/hopital-list']);
  }
}
