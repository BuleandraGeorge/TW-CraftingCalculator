import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewProduct } from '../../models/NewProduct';
import { Product } from '../../models/Product';
import { map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsServices {
  private apiUrl = 'http://localhost:5000'; // Flask runs on port 5000

  constructor(private http: HttpClient) {}

  addProduct(product: NewProduct) {
    return this.http.post<{ success: boolean, id: string }>(`${this.apiUrl}/add-product`, product);
  }

  getProducts(): Observable<Product[]>{
    
    return this.http.get<[]>(`${this.apiUrl}/get_products`).pipe(
      map(data => data.map((product: any)=> new Product(product._id,product.name, product.composition)))
    );
  }

}