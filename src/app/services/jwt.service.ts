import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

   public getUserRole(){
   const  token   = localStorage.getItem('token')?? '';
    console.log("AuthInterceptor")
    const decoded: any = jwtDecode(token);
    return decoded.roles
  }
}
