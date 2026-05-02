import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AmbulanceService } from '../../services/ambulance.service';
import { ScannerService } from '../../services/scanner.service';
import { LitService } from '../../services/lit.service';

@Component({
  selector: 'app-reclamation-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './reclamation-details.component.html',
  styleUrl: './reclamation-details.component.css'
})
export class ReclamationDetailsComponent implements OnInit {
  reclamationForm: FormGroup;
  reclamationId!: number;
  isEditMode: boolean = false;
  loading: boolean = true;
  types = ['AMBULANCE', 'SCANNER', 'LIT'];
  statuses = ['NON_TRAITE', 'EN_COURS', 'TRAITE', 'ANNULE'];
  cibles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private ambulanceService: AmbulanceService,
    private scannerService: ScannerService,
    private litService: LitService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.reclamationForm = this.fb.group({
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      typeCible: ['', Validators.required],
      cibleId: ['', Validators.required],
      statut: ['', Validators.required],
      dateCreation: [''],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.reclamationId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadReclamationDetails();
    }

    this.reclamationForm.get('typeCible')?.valueChanges.subscribe(type => {
      if (this.isEditMode) {
        this.loadCibles(type);
      }
    });
  }

  loadReclamationDetails(): void {
    this.reclamationService.getReclamationById(this.reclamationId).subscribe({
      next: (data) => {
        this.reclamationForm.patchValue(data);
        this.loadCibles(data.typeCible);
        this.loading = false;
        this.reclamationForm.disable();
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement ❌', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadCibles(type: string): void {
    this.cibles = [];
    if (!type) return;

    if (type === 'AMBULANCE') {
      this.ambulanceService.getAllAmbulances().subscribe({
        next: (data) => this.cibles = data,
        error: (err) => console.error('Erreur chargement ambulances', err)
      });
    } else if (type === 'SCANNER') {
      this.scannerService.getAllScanners().subscribe({
        next: (data) => this.cibles = data,
        error: (err) => console.error('Erreur chargement scanners', err)
      });
    } else if (type === 'LIT') {
      this.litService.getAllLits().subscribe({
        next: (data) => this.cibles = data,
        error: (err) => console.error('Erreur chargement lits', err)
      });
    }
  }

  getCibleLabel(cible: any): string {
    if (!cible) return '';
    const type = this.reclamationForm.get('typeCible')?.value;
    if (type === 'AMBULANCE') return cible.matricule || '';
    if (type === 'SCANNER') return `${cible.marque} ${cible.modele}` || '';
    if (type === 'LIT') return cible.numero || '';
    return '';
  }

  getSelectedCibleLabel(): string {
    const cibleId = this.reclamationForm.get('cibleId')?.value;
    if (!cibleId || this.cibles.length === 0) return '';
    const selectedCible = this.cibles.find(c => c.id === cibleId);
    return this.getCibleLabel(selectedCible);
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.reclamationForm.enable();
      this.reclamationForm.get('dateCreation')?.disable();
      this.reclamationForm.get('firstName')?.disable();
      this.reclamationForm.get('lastName')?.disable();
      this.reclamationForm.get('typeCible')?.disable();
    } else {
      this.reclamationForm.disable();
      this.loadReclamationDetails();
    }
  }

  onSubmit(): void {
    if (this.reclamationForm.valid) {
      const formData = {
        sujet: this.reclamationForm.get('sujet')?.value,
        description: this.reclamationForm.get('description')?.value,
        typeCible: this.reclamationForm.get('typeCible')?.value,
        cibleId: this.reclamationForm.get('cibleId')?.value,
        statut: this.reclamationForm.get('statut')?.value
      };

      this.reclamationService.updateReclamation(this.reclamationId, formData).subscribe({
        next: () => {
          this.snackBar.open('Réclamation modifiée avec succès ✓', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.isEditMode = false;
          this.loadReclamationDetails();
        },
        error: (err) => {
          console.error('Erreur lors de la modification', err);
          this.snackBar.open('Erreur lors de la modification ❌', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home/reclamation-list']);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
