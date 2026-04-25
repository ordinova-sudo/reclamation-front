import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScannerService } from '../../services/scanner.service';
import { HopitalService } from '../../services/hopital.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scanner-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './scanner-details.component.html',
  styleUrl: './scanner-details.component.css'
})
export class ScannerDetailsComponent implements OnInit {
  scannerId: number | null = null;
  loading: boolean = true;
  editMode: boolean = false;
  hopitals: any[] = [];

  scannerForm = new FormGroup({
    modele: new FormControl('', Validators.required),
    marque: new FormControl('', Validators.required),
    disponible: new FormControl(true, Validators.required),
    etat: new FormControl('', Validators.required),
    hopital: new FormControl(null, Validators.required),
    hopitalNom: new FormControl('')
  });

  etatsScanner = ['FONCTIONNEL', 'EN_PANNE', 'MAINTENANCE'];

  constructor(
    private scannerService: ScannerService,
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
        this.scannerId = +id;
        this.loadScannerDetails(this.scannerId);
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

  loadScannerDetails(id: number): void {
    this.scannerService.getScannerById(id).subscribe({
      next: (data) => {
        this.scannerForm.patchValue({
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
    if (!this.editMode && this.scannerId) {
      this.loadScannerDetails(this.scannerId);
    }
  }

  onSubmit(): void {
    if (this.scannerForm.valid && this.scannerId) {
      const { hopitalNom, ...formData } = this.scannerForm.value;

      this.scannerService.updateScanner(this.scannerId, formData).subscribe({
        next: (res) => {
          this.snackBar.open('Scanner modifié avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.editMode = false;
          this.loadScannerDetails(this.scannerId!);
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
    this.router.navigate(['/home/scanner-list']);
  }
}
