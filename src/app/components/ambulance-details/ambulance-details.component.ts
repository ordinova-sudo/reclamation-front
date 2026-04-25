import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AmbulanceService } from '../../services/ambulance.service';
import { HopitalService } from '../../services/hopital.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ambulance-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './ambulance-details.component.html',
  styleUrl: './ambulance-details.component.css'
})
export class AmbulanceDetailsComponent implements OnInit {
  ambulanceId: number | null = null;
  loading: boolean = true;
  editMode: boolean = false;
  hopitals: any[] = [];

  ambulanceForm = new FormGroup({
    matricule: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    disponible: new FormControl(true, Validators.required),
    latitude: new FormControl(null),
    longitude: new FormControl(null),
    hopital: new FormControl(null, Validators.required),
    hopitalNom: new FormControl('')
  });

  typesAmbulance = ['MEDICALISEE', 'TRANSPORT_SIMPLE'];

  constructor(
    private ambulanceService: AmbulanceService,
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
        this.ambulanceId = +id;
        this.loadAmbulanceDetails(this.ambulanceId);
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

  loadAmbulanceDetails(id: number): void {
    this.ambulanceService.getAmbulanceById(id).subscribe({
      next: (data) => {
        this.ambulanceForm.patchValue({
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
    if (!this.editMode && this.ambulanceId) {
      this.loadAmbulanceDetails(this.ambulanceId);
    }
  }

  onSubmit(): void {
    if (this.ambulanceForm.valid && this.ambulanceId) {
      const { hopitalNom, ...formData } = this.ambulanceForm.value;

      this.ambulanceService.updateAmbulance(this.ambulanceId, formData).subscribe({
        next: (res) => {
          this.snackBar.open('Ambulance modifiée avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.editMode = false;
          this.loadAmbulanceDetails(this.ambulanceId!);
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
    this.router.navigate(['/home/ambulance-list']);
  }
}
