import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
