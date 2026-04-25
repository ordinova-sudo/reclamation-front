import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LitService } from '../../services/lit.service';
import { HopitalService } from '../../services/hopital.service';

@Component({
  selector: 'app-lit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './lit.component.html',
  styleUrl: './lit.component.css'
})
export class LitComponent implements OnInit {
  hopitals: any[] = [];

  constructor(
    private litService: LitService,
    private hopitalService: HopitalService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  litForm = new FormGroup({
    numero: new FormControl('', Validators.required),
    estOccupe: new FormControl(false, Validators.required),
    type: new FormControl('', Validators.required),
    etat: new FormControl('', Validators.required),
    hopital: new FormControl(null, Validators.required)
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

  ngOnInit(): void {
    this.loadHopitals();
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

  onSubmit() {
    if (this.litForm.valid) {
      this.litService.createLit(this.litForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Lit ajouté avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/home/lit-list']);
        },
        error: (err) => {
          this.snackBar.open("Erreur lors de l'ajout du lit ❌", 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
