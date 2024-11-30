import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// MODELS
import { Subcategory } from '../models/subcategory.model';

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SubcategoriasService {

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
   *  LOAD SUBCATEGORIES
  ==================================================================== */
  loadSubcategories(query: any){
    return this.http.post<{ok: boolean, subcategories: Subcategory[], total: number}>( `${base_url}/subcategory/query`, query, this.headers );
  }

  /** ================================================================
   *  CREATE CATEGORY
  ==================================================================== */
  createSubcategory(formData: any){
    return this.http.post<{ok: Boolean, subcategory: Subcategory}>(`${base_url}/subcategory`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE CATEGORY
  ==================================================================== */
  updateSubcategory(formData: any, id: string){
    return this.http.put<({ok: Boolean, subcategory: Subcategory})>(`${base_url}/subcategory/${id}`, formData, this.headers);
  }
}
