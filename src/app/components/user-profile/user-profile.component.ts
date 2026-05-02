import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  profileForm: FormGroup;
  loading: boolean = true;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserProfile();
    } else {
      this.loading = false;
    }
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        
        if (userId) {
          this.userService.getUserById(userId).subscribe({
            next: (data) => {
              this.user = data;
              this.profileForm.patchValue({
                email: data.email,
                phoneNumber: data.phoneNumber
              });
              this.profileForm.disable();
              this.loading = false;
            },
            error: (err) => {
              console.error('Erreur lors du chargement du profil', err);
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token', error);
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.profileForm.patchValue({
        email: this.user.email,
        phoneNumber: this.user.phoneNumber
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updateData = {
        id: this.user.id,
        email: this.profileForm.get('email')?.value,
        phoneNumber: this.profileForm.get('phoneNumber')?.value
      };

      this.userService.updateUser(this.user.id, updateData).subscribe({
        next: () => {
          this.snackBar.open('Profil mis à jour avec succès ✓', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.isEditMode = false;
          this.loadUserProfile();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
          this.snackBar.open('Erreur lors de la mise à jour ❌', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
