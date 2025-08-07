import { Component } from '@angular/core';
import { ProductsServices } from '../../../services/products/productsServices';
import { Product } from '../../../models/Product';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.html',
  styleUrl: './view.css'
})

export class ProductsView {
  products: Product[] = [];

  constructor(private productsService: ProductsServices) {
    this.loadProducts();
  }
  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: products => this.products = products,
      error: err => console.error('Failed to fetch products:', err)
    })
  }

}