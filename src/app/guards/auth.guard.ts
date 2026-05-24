import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // Vérifier si on est côté navigateur
  if (!isPlatformBrowser(platformId)) {
    return true; // Laisser passer côté serveur, la vérification se fera côté client
  }
  
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000; 
      
      if (Date.now() < expiration) {
        return true; 
      } else {
        // Token expiré
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      console.error('Token invalide', error);
      localStorage.removeItem('token');
      router.navigate(['/login']);
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }
};
