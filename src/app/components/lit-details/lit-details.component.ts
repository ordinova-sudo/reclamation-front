import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LitService } from '../../services/lit.service';
import { HopitalService } from '../../services/hopital.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lit-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './lit-details.component.html',
  styleUrl: './lit-details.component.css'
})
export class LitDetailsComponent implements OnInit {
  litId: number | null = null;
  loading: boolean = true;
  editMode: boolean = false;
  hopitals: any[] = [];

  litForm = new FormGroup({
    numero: new FormControl('', Validators.required),
    estOccupe: new FormControl(false, Validators.required),
    type: new FormControl('', Validators.required),
    etat: new FormControl('', Validators.required),
    hopital: new FormControl(null, Validators.required),
    hopitalNom: new FormControl('')
  });

  typesLit = [
    'STANDARD',
    'REANIMATION',
    'URGENCE',
    'PEDIATRIQUE',
    'MATERNITE',
    'CHIRURGICAL',
    'LONGUE_DUREE',
    'PSYCHIATRIQUE',
    'ISOLEMENT',
    'SOINS_PALLIATIFS'
  ];

  etatsLit = ['PROPRE', 'SALE', 'EN_MAINTENANCE'];

  constructor(
    private litService: LitService,
    private hopitalService: HopitalService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadHopitals();
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.litId = +id;
        this.loadLitDetails(this.litId);
      }
    } else {
      this.loading = false;
    }
  }

  loadHopitals(): void {
    this.hopitalService.getAllHopitals().subscribe({
      next: (data) => {
        this.hopitals = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôpitaux', err);
      }
    });
  }

  loadLitDetails(id: number): void {
    this.litService.getLitById(id).subscribe({
      next: (data) => {
        this.litForm.patchValue({
          ...data,
          hopitalNom: data.hopital?.nom || ''
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

  compareHopitals(h1: any, h2: any): boolean {
    return h1 && h2 ? h1.id === h2.id : h1 === h2;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.litId) {
      this.loadLitDetails(this.litId);
    }
  }

  onSubmit(): void {
    if (this.litForm.valid && this.litId) {
      const { hopitalNom, ...formData } = this.litForm.value;

      this.litService.updateLit(this.litId, formData).subscribe({
        next: (res) => {
          this.snackBar.open('Lit modifié avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.editMode = false;
          this.loadLitDetails(this.litId!);
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
    this.router.navigate(['/home/lit-list']);
  }
}
