import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../models/empresa.model';
import { tap } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  public empresa!: Empresa;

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
    loadEmpresa(){
      return this.http.get<{ok: boolean, empresa: Empresa, total: number}>( `${base_url}/asdas`, this.headers )
        .pipe(
          tap(({ok, empresa}) => {            
            this.empresa = empresa;            
          })
        );
    }
  
    /** ================================================================
     *  CREATE
    ==================================================================== */
    createEmpresa(formData: any){
      return this.http.post<{ok: Boolean, empresa: Empresa}>(`${base_url}/asdas`, formData, this.headers);
    }
  
    /** ================================================================
     *  UPDATE
    ==================================================================== */
    updateEmpresa(formData: any, id: string){
      return this.http.put<({ok: Boolean, empresa: Empresa})>(`${base_url}/asdas/${id}`, formData, this.headers);
    }

}
