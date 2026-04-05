import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HomeApplicationComponent } from './components/home-application/home-application.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HopitalComponent } from './components/hopital/hopital.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ FormsModule,HomeComponent,RouterOutlet,RouterLink,RouterModule,HttpClientModule,HomeApplicationComponent,SignInComponent,SignUpComponent,HopitalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerceFront';
  message = '';
  myMessage=''
receiveMessage(msg: string) {
  this.message = msg;
}
flexConsumer( message:string){
  this.myMessage=message;
}

  toggle = true;
  msg = 'Bonjour étudiants !';
}
