import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { JwtService } from '../services/jwt.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private  jwtService:JwtService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const  token   = localStorage.getItem('token')?? '';
    alert("AuthInterceptor")
    alert(this.jwtService.getUserRole());
    const authReq = token?
     req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;
  
    return next.handle(authReq);
  }
}

