import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HopitalService } from '../../services/hopital.service';

@Component({
  selector: 'app-hopital',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,MatSnackBarModule],
  templateUrl: './hopital.component.html',
  styleUrl: './hopital.component.css'
})
export class HopitalComponent {

  constructor(private hopitalService: HopitalService,private snackBar: MatSnackBar,private router: Router) {}
  hopitalForm = new FormGroup({
  nom: new FormControl('', Validators.required),
  gouvernorat: new FormControl('', Validators.required),
  ville: new FormControl(''),
  adresse: new FormControl(''),

  latitude: new FormControl(null),
  longitude: new FormControl(null),

  telephone: new FormControl(''),
  email: new FormControl(''),
  siteWeb: new FormControl(''),

  type: new FormControl('', Validators.required),

  urgence: new FormControl(false),

  heureOuverture: new FormControl(''),
  heureFermeture: new FormControl(''),

  description: new FormControl('')
});

// Liste des 24 gouvernorats
gouvernorats: string[] = [
  'Tunis','Ariana','Ben Arous','Manouba',
  'Nabeul','Zaghouan','Bizerte','Béja',
  'Jendouba','Le Kef','Siliana','Kairouan',
  'Kasserine','Sidi Bouzid','Sousse','Monastir',
  'Mahdia','Sfax','Gabès','Médenine',
  'Tataouine','Gafsa','Tozeur','Kébili'
];

onSubmit() {
  if (this.hopitalForm.valid) {
    console.log("Formulaire valide :", this.hopitalForm.value);
    this.hopitalService.createHopital(this.hopitalForm.value).subscribe({
        next: (res) => {
           this.snackBar.open(
      'Categorie ajoutée avec succés 🎉',
      'Fermer',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/home']);
      //this.categoryForm.reset();
        },
        error: (err) => {
           this.snackBar.open(
      "Erreur lors de l'ajout de catégorie ❌",
      'Fermer',
      {
        duration: 3000,
        panelClass: ['error-snackbar']
      }
    );
        }
      });

    } else {
      console.log("Formulaire invalide !");
    };
    
}
}