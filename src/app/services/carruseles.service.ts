import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Carrusel } from '../models/carrusel.model';

import { environment } from '../../environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CarruselesService {

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
   *  LOAD
  ==================================================================== */
  loadCarruseles(query: any){
    return this.http.post<{ok: boolean, carruseles: Carrusel[], total:number}>( `${base_url}/carrusel/query`, query, this.headers );
  }

  /** ================================================================
   *  CREATE
  ==================================================================== */
  createCarrusel(formData: any){
    return this.http.post<{ok: Boolean, carrusel: Carrusel}>(`${base_url}/carrusel`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE
  ==================================================================== */
  updateCarrusel(formData: any, id: string){
    return this.http.put<({ok: Boolean, carrusel: Carrusel})>(`${base_url}/carrusel/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  DELETE
  ==================================================================== */
  deleteCarrusel(id: string){
    return this.http.delete<({ok: Boolean, msg: string})>(`${base_url}/carrusel/${id}`, this.headers);
  }

}
