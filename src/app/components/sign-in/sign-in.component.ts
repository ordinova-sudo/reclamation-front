import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

    user = {
    identifier: '',
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
