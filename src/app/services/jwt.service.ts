import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  public getUserRole() {
    // Vérifier si on est côté navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    
    const token = localStorage.getItem('token') ?? '';
    
    if (!token) {
      return [];
    }
    
    try {
      console.log("AuthInterceptor");
      const decoded: any = jwtDecode(token);
      return decoded.roles;
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return [];
    }
  }
}
