import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { HomeApplicationComponent } from './components/home-application/home-application.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HopitalComponent } from './components/hopital/hopital.component';
import { HopitalListComponent } from './components/hopital-list/hopital-list.component';
import { HopitalDetailsComponent } from './components/hopital-details/hopital-details.component';
import { HomeDashboardComponent } from './components/home-dashboard/home-dashboard.component';
import { AgentHospitaliseComponent } from './components/agent-hospitalise/agent-hospitalise.component';
import { AgentListComponent } from './components/agent-list/agent-list.component';
import { AgentDetailsComponent } from './components/agent-details/agent-details.component';
import { AmbulanceComponent } from './components/ambulance/ambulance.component';
import { AmbulanceListComponent } from './components/ambulance-list/ambulance-list.component';
import { AmbulanceDetailsComponent } from './components/ambulance-details/ambulance-details.component';
import { LitComponent } from './components/lit/lit.component';
import { LitListComponent } from './components/lit-list/lit-list.component';
import { LitDetailsComponent } from './components/lit-details/lit-details.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { ScannerListComponent } from './components/scanner-list/scanner-list.component';
import { ScannerDetailsComponent } from './components/scanner-details/scanner-details.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';


export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'signIn', component: SignInComponent },
    { path: 'signUp', component: SignUpComponent },
    { path: 'login', component: SignInComponent },
    { 
      path: 'home', 
      component: HomeApplicationComponent,
      canActivate: [authGuard],
      children: [
        { path: '', component: HomeDashboardComponent },
        { path: 'addHopital', component: HopitalComponent },
        { path: 'hopital-list', component: HopitalListComponent },
        { path: 'hopital-details/:id', component: HopitalDetailsComponent },
        { path: 'addAgent', component: AgentHospitaliseComponent },
        { path: 'agent-list', component: AgentListComponent },
        { path: 'agent-details/:id', component: AgentDetailsComponent },
        { path: 'addAmbulance', component: AmbulanceComponent },
        { path: 'ambulance-list', component: AmbulanceListComponent },
        { path: 'ambulance-details/:id', component: AmbulanceDetailsComponent },
        { path: 'addLit', component: LitComponent },
        { path: 'lit-list', component: LitListComponent },
        { path: 'lit-details/:id', component: LitDetailsComponent },
        { path: 'addScanner', component: ScannerComponent },
        { path: 'scanner-list', component: ScannerListComponent },
        { path: 'scanner-details/:id', component: ScannerDetailsComponent },
        { path: 'profile', component: UserProfileComponent }
      ]
    },
   /* { path: 'getAllCategorie', component: GetAllCategorieComponent },*/


];
