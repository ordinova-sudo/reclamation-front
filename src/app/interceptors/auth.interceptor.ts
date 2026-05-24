import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { JwtService } from '../services/jwt.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private jwtService: JwtService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vérifier si on est côté navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(req);
    }
    
    const token = localStorage.getItem('token') ?? '';
    
    if (req.url.includes('/api/v1/auth/signin')) {
      return next.handle(req);
    }
    
    const authReq = token ?
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      : req;
     
    return next.handle(authReq);
  }
}

