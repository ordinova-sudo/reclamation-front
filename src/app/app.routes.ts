import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { HomeApplicationComponent } from './components/home-application/home-application.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HopitalComponent } from './components/hopital/hopital.component';


export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'signIn', component: SignInComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'home', component: HomeApplicationComponent },
    { path: 'addHopital', component: HopitalComponent},
   /* { path: 'getAllCategorie', component: GetAllCategorieComponent },*/


];
