import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ScannerService } from '../../services/scanner.service';
import { HopitalService } from '../../services/hopital.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.css'
})
export class ScannerComponent implements OnInit {
  hopitals: any[] = [];

  constructor(
    private scannerService: ScannerService,
    private hopitalService: HopitalService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  scannerForm = new FormGroup({
    modele: new FormControl('', Validators.required),
    marque: new FormControl('', Validators.required),
    disponible: new FormControl(true, Validators.required),
    etat: new FormControl('', Validators.required),
    hopital: new FormControl(null, Validators.required)
  });

  etatsScanner = ['FONCTIONNEL', 'EN_PANNE', 'MAINTENANCE'];

  ngOnInit(): void {
    this.loadHopitals();
  }

  loadHopitals(): void {
    this.hopitalService.getAllHopitalsNoPagination().subscribe({
      next: (data) => {
        this.hopitals = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôpitaux', err);
      }
    });
  }

  onSubmit() {
    if (this.scannerForm.valid) {
      this.scannerService.createScanner(this.scannerForm.value).subscribe({
        next: (res) => {
          this.snackBar.open('Scanner ajouté avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/home/scanner-list']);
        },
        error: (err) => {
          this.snackBar.open("Erreur lors de l'ajout du scanner ❌", 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
