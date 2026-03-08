import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  @Input() product!: Product;
  @Output() add = new EventEmitter<Product>();
addProduct() {
  this.add.emit(this.product);

}
}
