import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, MatSnackBarModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const password = this.userForm.get('password')?.value;
      const confirmPassword = this.userForm.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        this.snackBar.open(
          'Les mots de passe ne correspondent pas ❌',
          'Fermer',
          {
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
        return;
      }

      const formData = {
        firstName: this.userForm.get('firstName')?.value,
        lastName: this.userForm.get('lastName')?.value,
        fullName: `${this.userForm.get('firstName')?.value} ${this.userForm.get('lastName')?.value}`,
        email: this.userForm.get('email')?.value,
        phoneNumber: this.userForm.get('phoneNumber')?.value,
        password: this.userForm.get('password')?.value
      };

      this.authService.signUp(formData).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.accessToken);
          this.snackBar.open(
            'Inscription réussie 🎉',
            'Fermer',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );
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
      this.userForm.markAllAsTouched();
    }
  }
}
