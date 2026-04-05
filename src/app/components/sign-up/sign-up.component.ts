import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
//signUp
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,MatSnackBarModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
 lat!: number;
  lng!: number;
  constructor(private authService: AuthService,private snackBar: MatSnackBar,private router: Router) {}
  userForm  =new FormGroup(
{
  firstName: new FormControl("",Validators.required),
  password: new FormControl("",[Validators.required]),
  email: new FormControl("",[Validators.required,Validators.email]),
  lastName: new FormControl("",Validators.required)
}

  )
  
  onSubmit() {
    if (this.userForm.valid) {
      console.log("Formulaire valide :", this.userForm.value);
      this.authService.signUp(this.userForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.accessToken);
           this.snackBar.open(
      'Inscription réussie 🎉',
      'Fermer',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/home']);
      this.userForm.reset();
        },
        error: (err) => {
           this.snackBar.open(
      "Erreur lors de l'inscription ❌",
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
      this.userForm.markAllAsTouched(); // Montre toutes les erreurs
    }
  }
}
