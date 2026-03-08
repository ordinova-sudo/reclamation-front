import { Routes } from '@angular/router';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { HomeComponent } from './home/home.component';
import { HomeApplicationComponent } from './home-application/home-application.component';
import { CategorieComponent } from './categorie/categorie.component';
import { GetAllCategorieComponent } from './get-all-categorie/get-all-categorie.component';

export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'signIn', component: TemplateDrivenFormComponent },
    { path: 'signUp', component: ReactiveFormComponent },
    { path: 'home', component: HomeApplicationComponent },
    { path: 'addCategorie', component: CategorieComponent},
    { path: 'getAllCategorie', component: GetAllCategorieComponent },


];
