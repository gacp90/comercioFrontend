import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LogProduct } from '../models/category.model copy';

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class LogproductsService {

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
  loadLogProducts(query: any){
    return this.http.post<{ok: boolean, logproducts: LogProduct[], total: number}>( `${base_url}/logproducts/query`, query, this.headers );
  }
}
