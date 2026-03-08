import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../user';
import { AuthService } from '../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-driven-form',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './template-driven-form.component.html',
  styleUrl: './template-driven-form.component.css'
})
export class TemplateDrivenFormComponent {

    user = {
    email: '',
    password: ''
  };

    constructor(private authService: AuthService,
    private snackBar: MatSnackBar,private router: Router) {}
  submitForm(form: NgForm){  
     if (form.valid) {
      console.log("Formulaire valide :", form.value);
      this.authService.signIn(form.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.accessToken);
           this.snackBar.open(
      'Authentification réussie 🎉',
      'Fermer',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/home']);
       form.reset();
        },
        error: (err) => {
           this.snackBar.open(
      "Erreur lors de l'Authentification ❌",
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
