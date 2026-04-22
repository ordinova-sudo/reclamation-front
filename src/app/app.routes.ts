import { Routes } from '@angular/router';

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


export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'signIn', component: SignInComponent },
    { path: 'signUp', component: SignUpComponent },
    { 
      path: 'home', 
      component: HomeApplicationComponent,
      children: [
        { path: '', component: HomeDashboardComponent },
        { path: 'addHopital', component: HopitalComponent },
        { path: 'hopital-list', component: HopitalListComponent },
        { path: 'hopital-details/:id', component: HopitalDetailsComponent },
        { path: 'addAgent', component: AgentHospitaliseComponent },
        { path: 'agent-list', component: AgentListComponent },
        { path: 'agent-details/:id', component: AgentDetailsComponent }
      ]
    },
   /* { path: 'getAllCategorie', component: GetAllCategorieComponent },*/


];
