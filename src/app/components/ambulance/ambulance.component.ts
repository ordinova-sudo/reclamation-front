import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AmbulanceService } from '../../services/ambulance.service';
import { HopitalService } from '../../services/hopital.service';

@Component({
  selector: 'app-ambulance',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './ambulance.component.html',
  styleUrl: './ambulance.component.css'
})
export class AmbulanceComponent implements OnInit {
  hopitals: any[] = [];

  constructor(
    private ambulanceService: AmbulanceService,
    private hopitalService: HopitalService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ambulanceForm = new FormGroup({
    matricule: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    disponible: new FormControl(true, Validators.required),
    latitude: new FormControl(null),
    longitude: new FormControl(null),
    hopital: new FormControl(null, Validators.required)
  });

  typesAmbulance = ['MEDICALISEE', 'TRANSPORT_SIMPLE'];

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
    if (this.ambulanceForm.valid) {
      this.ambulanceService.createAmbulance(this.ambulanceForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Ambulance ajoutée avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/home/ambulance-list']);
        },
        error: (err) => {
          this.snackBar.open("Erreur lors de l'ajout de l'ambulance ❌", 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
