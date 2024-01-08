import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postProduct(newProduct:IProduct){
    return this.http.post<IProduct>('http://localhost:3000/productList/',newProduct)
  }

  getProduct(){
    return this.http.get<IProduct[]>("http://localhost:3000/productList/")
  }

  updateProduct(product:IProduct,id:number){
    return this.http.put<IProduct>("http://localhost:3000/productList/"+id,product)
  }

  deleteProduct(id:number){
    return this.http.delete("http://localhost:3000/productList/"+id)
  }
}
