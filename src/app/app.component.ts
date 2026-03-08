import { Component } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { DemoComponent } from './demo/demo.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveFormComponent } from './reactive-form/reactive-form.component';
import { CycleDeVieComponent } from './cycle-de-vie/cycle-de-vie.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HomeApplicationComponent } from './home-application/home-application.component';
import { CategorieComponent } from './categorie/categorie.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CategoryItemComponent } from './category-item/category-item.component';
import { GetAllCategorieComponent } from './get-all-categorie/get-all-categorie.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ProductListComponent,DemoComponent,TemplateDrivenFormComponent,ReactiveFormComponent,
    CycleDeVieComponent,FormsModule,HomeComponent,RouterOutlet,RouterLink,RouterModule,HttpClientModule,HomeApplicationComponent,CategorieComponent,CategoryItemComponent,GetAllCategorieComponent],
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
