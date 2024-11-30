import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoadPrefix } from '../interfaces/load-prefix.interface';

// ENVIRONMENT
import { Category } from '../models/category.model';

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

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
   *  LOAD CATEGORIES
  ==================================================================== */
  loadCategories(query: any){
    return this.http.post<{ok: boolean, categories: Category[], total: number}>( `${base_url}/category/query`, query, this.headers );
  }

  /** ================================================================
   *  CREATE CATEGORY
  ==================================================================== */
  createCategory(formData: any){
    return this.http.post<{ok: Boolean, category: Category}>(`${base_url}/category`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE CATEGORY
  ==================================================================== */
  updateCategory(formData: any, id: string){
    return this.http.put<({ok: Boolean, category: Category})>(`${base_url}/category/${id}`, formData, this.headers);
  }


  // FIN DE LA CLASE
}
