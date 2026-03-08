import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategorieService } from '../services/categorie.service';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,MatSnackBarModule ],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export class CategorieComponent {

  constructor(private categorieService: CategorieService,
  private snackBar: MatSnackBar,private router: Router) {}
  categoryForm  =new FormGroup(
{
  categoryName: new FormControl("",Validators.required),
}

  )
 onSubmit() {
    if (this.categoryForm.valid) {
      console.log("Formulaire valide :", this.categoryForm.value);
      this.categorieService.ajouterCategorie(this.categoryForm.value).subscribe({
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
    }
  }
}
