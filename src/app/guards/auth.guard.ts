import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
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
