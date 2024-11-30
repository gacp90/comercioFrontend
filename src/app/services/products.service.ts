import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

// MODELS
import { Product } from '../models/products.model';

// INTERFACES
import { LoadProducts } from '../interfaces/load-products.interface';

// ENVIRONMENT
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(  private http: HttpClient) { }

  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *   LOAD PRODUCTS
  ==================================================================== */
  loadProducts(query: any){
    return this.http.post<LoadProducts>( `${base_url}/products/query`, query, this.headers );
  }

  /** ================================================================
   *   GET PRODUCT ID
  ==================================================================== */
  loadProductId(id: string){
    return this.http.get<{product: Product, ok: boolean}>(`${base_url}/products/${id}`, this.headers);
  }

  /** ================================================================
   *   GET PRODUCT ID
  ==================================================================== */
  loadProductCode(code: string){
    return this.http.get<{product: Product, ok: boolean}>(`${base_url}/products/codigo/${code}`, this.headers);
  }

  /** ================================================================
   *   GET PRODUCTS OF CLIENTS
  ==================================================================== */
  loadProductsClient(client: string){
    return this.http.get<{ products: Product[], ok: boolean }>(`${base_url}/products/client/${client}`, this.headers);
  }

  /** ================================================================
   *   GET COUNT PRODUCTS PREFIX
  ==================================================================== */
  loadProductsPrefix(prefix: string){
    return this.http.get<{ total: number, ok: boolean }>(`${base_url}/products/count/${prefix}`, this.headers);
  }

  /** ================================================================
   *   CREATE PRODUCTS
  ==================================================================== */
  createProduct( formData: any ){
    return this.http.post<{ok: boolean, product: Product}>(`${base_url}/products`, formData, this.headers);
  }

  /** ================================================================
   *   CREATE PRODUCTS EXCEL
  ==================================================================== */
  createProductExcel( formData: any ){
    return this.http.post<{ok: boolean, total: number}>(`${base_url}/products/create/excel`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE PRODUCTS
  ==================================================================== */
  updateProduct( formData:any, id: string ){
    return this.http.put<{ok: boolean, product: Product}>(`${base_url}/products/${id}`, formData, this.headers);
  }
  
  /** ================================================================
   *   UPDATE STATUS PRODUCTS
  ==================================================================== */
  changeStatus(pid: string){
    return this.http.delete<{ok: boolean, product: Product}>(`${base_url}/products/${pid}`, this.headers)
  }

  // FIN DE LA CLASE
}
