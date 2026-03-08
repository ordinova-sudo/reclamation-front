import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../services/categorie.service';
import { CommonModule } from '@angular/common';
import { CategoryItemComponent } from '../category-item/category-item.component';
import { Category } from '../interfaces/category';

@Component({
  selector: 'app-get-all-categorie',
  standalone: true,
  imports: [CommonModule,CategoryItemComponent],
  templateUrl: './get-all-categorie.component.html',
  styleUrl: './get-all-categorie.component.css'
})
export class GetAllCategorieComponent implements OnInit {

 listCategories: Category[] = [];
 
 constructor(private categoryService:CategorieService){}
 ngOnInit(): void {
    this.categoryService.getAllCategorie().subscribe( 
      {next: (data) => this.listCategories = data,
    error: (err) => console.error(err)
         

  });
 }
}
