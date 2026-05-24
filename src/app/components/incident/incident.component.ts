import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-incident',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './incident.component.html',
  styleUrl: './incident.component.css'
})
export class IncidentComponent implements OnInit {
  incidentForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.incidentForm = this.fb.group({
      sujet: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
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
      
      // Ajouter automatiquement typeCible: 'INCIDENT'
      const incidentData = {
        ...this.incidentForm.value,
        userId: userId,
        typeCible: 'INCIDENT'
      };
      
      this.reclamationService.createReclamation(incidentData).subscribe({
        next: () => {
          this.snackBar.open('Panne technique créée avec succès ✓', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/home/incident-list']);
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
    this.router.navigate(['/home/incident-list']);
  }
}
