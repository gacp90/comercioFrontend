import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

// MODELS
import { Client } from '../models/clients.model';

// INTERFACES
import { LoadClients } from '../interfaces/load-clients.interface';

// ENVIRONMENT
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

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
   *   LOAD CLIENTS
  ==================================================================== */
  loadClients(desde: number, limite: number){
    return this.http.get<LoadClients>( `${base_url}/clients?desde=${desde}&limite=${limite}`, this.headers );
  }

  /** ================================================================
   *   LOAD CLIENTS
  ==================================================================== */
  loadClientById(cid: string){
    return this.http.get<{ok: boolean, client: Client}>( `${base_url}/clients/by/${cid}`, this.headers );
  }

  /** ================================================================
   *   LOAD LEVELS
  ==================================================================== */
  loadLevelsClients(cid: string){
    return this.http.get<{ok: boolean, first: Client[], two: Client[], three: Client[], four: Client[]}>( `${base_url}/clients/level/${cid}`, this.headers );
  }

  /** ================================================================
   *   CREATE CLIENTS
  ==================================================================== */
  createClient( formData: any ){
    return this.http.post<{ok: boolean, client: Client}>(`${base_url}/clients`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE CLIENTS
  ==================================================================== */
  updateClient( formData:any, id: string ){
    return this.http.put<{ok: boolean, client: Client}>(`${base_url}/clients/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  DELETE CLIENT
  ==================================================================== */
  deleteClient(id: string){
    return this.http.delete<({ok: Boolean, client: Client})>(`${base_url}/clients/${id}`, this.headers);
  }

}
