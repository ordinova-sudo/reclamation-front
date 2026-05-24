import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AmbulanceService } from '../../services/ambulance.service';
import { ScannerService } from '../../services/scanner.service';
import { LitService } from '../../services/lit.service';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css'
})
export class ReclamationComponent implements OnInit {
  reclamationForm: FormGroup;
  types = ['AMBULANCE', 'SCANNER', 'LIT'];
  cibles: any[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private ambulanceService: AmbulanceService,
    private scannerService: ScannerService,
    private litService: LitService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.reclamationForm = this.fb.group({
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      typeCible: ['', Validators.required],
      cibleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.reclamationForm.get('typeCible')?.valueChanges.subscribe(type => {
      this.loadCibles(type);
      this.reclamationForm.patchValue({ cibleId: '' });
    });
  }

  loadCibles(type: string): void {
    this.cibles = [];
    if (!type) return;

    if (type === 'AMBULANCE') {
      this.ambulanceService.getAllAmbulancesNoPagination().subscribe({
        next: (data) => this.cibles = data,
        error: (err) => console.error('Erreur chargement ambulances', err)
      });
    } else if (type === 'SCANNER') {
      this.scannerService.getAllScannersNoPagination().subscribe({
        next: (data) => this.cibles = data,
        error: (err) => console.error('Erreur chargement scanners', err)
      });
    } else if (type === 'LIT') {
      this.litService.getAllLitsNoPagination().subscribe({
        next: (data) => this.cibles = data,
        error: (err) => console.error('Erreur chargement lits', err)
      });
    }
  }

  getCibleLabel(cible: any): string {
    const type = this.reclamationForm.get('typeCible')?.value;
    if (type === 'AMBULANCE') return cible.matricule;
    if (type === 'SCANNER') return `${cible.marque} ${cible.modele}`;
    if (type === 'LIT') return cible.numero;
    return '';
  }

  onSubmit(): void {
    if (this.reclamationForm.valid) {
      this.loading = true;
      
      // Récupérer l'ID de l'utilisateur connecté depuis le token
      const token = localStorage.getItem('token');
      let userId = null;
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id;
        } catch (error) {
          console.error('Erreur lors du décodage du token', error);
        }
      }
      
      const reclamationData = {
        ...this.reclamationForm.value,
        userId: userId
      };
      
      this.reclamationService.createReclamation(reclamationData).subscribe({
        next: () => {
          this.snackBar.open('Réclamation créée avec succès ✓', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/home/reclamation-list']);
        },
        error: (err) => {
          console.error('Erreur lors de la création', err);
          this.snackBar.open('Erreur lors de la création ❌', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/home/reclamation-list']);
  }
}
