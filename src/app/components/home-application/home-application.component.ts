import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-application',
  standalone: true,
  imports: [ RouterModule, CommonModule  ],
  templateUrl: './home-application.component.html',
  styleUrl: './home-application.component.css'
})
export class HomeApplicationComponent implements OnInit {

  imageUrl: string = '/tunisiaMap.webp';
  selectedMenu: string = 'home';
  userProfile: any = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Vérifier si on est côté navigateur
    if (!isPlatformBrowser(this.platformId)) {
      this.userProfile = {
        firstName: 'Utilisateur',
        lastName: '',
        role: 'USER'
      };
      return;
    }
    
    // Récupérer les infos du localStorage (stockées lors de la connexion)
    const token = localStorage.getItem('token');
    console.log('Token trouvé:', token ? 'Oui' : 'Non');
    
    if (token) {
      try {
        // Décoder le token JWT pour extraire les infos utilisateur
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload décodé:', payload);
        
        this.userProfile = {
          firstName: payload.firstName || 'Utilisateur',
          lastName: payload.lastName || '',
          role: payload.role || 'USER'
        };
        console.log('UserProfile créé:', this.userProfile);
      } catch (error) {
        console.error('Erreur lors du décodage du token', error);
        this.userProfile = {
          firstName: 'Utilisateur',
          lastName: '',
          role: 'USER'
        };
      }
    } else {
      // Même sans token, créer un profil par défaut pour tester
      this.userProfile = {
        firstName: 'Utilisateur',
        lastName: 'Test',
        role: 'USER'
      };
      console.log('Pas de token, profil par défaut créé');
    }
  }

  logout(): void {
    // Vérifier si on est côté navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Supprimer le token et rediriger vers la page de connexion
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }

}
