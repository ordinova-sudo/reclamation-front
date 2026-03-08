import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './Product';
@Component({
selector: 'app-product-list',
standalone: true,
imports: [CommonModule],
templateUrl: './product-list.component.html',
styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
products = [{ name: 'Laptop', price: 1200, inStock: true }, 

{ name: 'Phone', price: 800, inStock: false },
{ name: 'Headphones', price: 150, inStock: true }
];


addToCart(product: string) {
alert(product + ' ajouté au panier!');
}


getItemStyle(inStock: boolean) {
return {
'background-color': inStock ? '#e0f7e9' : '#fde0e0',
'color': inStock ? '#27ae60' : '#c0392b'
};
}


getItemClass(inStock: boolean) {
return inStock ? 'in-stock' : 'out-of-stock';
}
}