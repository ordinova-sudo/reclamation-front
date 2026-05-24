import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-incident-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './incident-details.component.html',
  styleUrl: './incident-details.component.css'
})
export class IncidentDetailsComponent implements OnInit {
  incidentForm: FormGroup;
  incidentId!: number;
  isEditMode: boolean = false;
  loading: boolean = true;
  statuses = ['NON_TRAITE', 'EN_COURS', 'TRAITE', 'ANNULE'];

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.incidentForm = this.fb.group({
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      statut: ['', Validators.required],
      dateCreation: [''],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.incidentId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadIncidentDetails();
    }
  }

  loadIncidentDetails(): void {
    this.reclamationService.getReclamationById(this.incidentId).subscribe({
      next: (data) => {
        this.incidentForm.patchValue(data);
        this.loading = false;
        this.incidentForm.disable();
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

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.incidentForm.enable();
      this.incidentForm.get('dateCreation')?.disable();
      this.incidentForm.get('firstName')?.disable();
      this.incidentForm.get('lastName')?.disable();
    } else {
      this.incidentForm.disable();
      this.loadIncidentDetails();
    }
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      const formData = {
        sujet: this.incidentForm.get('sujet')?.value,
        description: this.incidentForm.get('description')?.value,
        statut: this.incidentForm.get('statut')?.value,
        typeCible: 'INCIDENT'
      };

      this.reclamationService.updateReclamation(this.incidentId, formData).subscribe({
        next: () => {
          this.snackBar.open('Panne technique modifiée avec succès ✓', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.isEditMode = false;
          this.loadIncidentDetails();
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
    this.router.navigate(['/home/incident-list']);
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
