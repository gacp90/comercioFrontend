import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedidos.model';

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

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
   *  LOAD PEDIDOS
  ==================================================================== */
  loadPedidos(query: any){
    return this.http.post<{ok: boolean, pedidos: Pedido[], total: number, pendientes: number, enviandos: number, entregados: number}>( `${base_url}/pedidos/query`, query, this.headers );
  }

  /** ================================================================
   *  LOAD PEDIDO ID
  ==================================================================== */
  loadPedidoID(id: string){
    return this.http.get<{ok: boolean, pedido: Pedido}>( `${base_url}/pedidos/${id}`, this.headers );
  }

  /** ================================================================
   *  CREATE PEDIDO
  ==================================================================== */
  createPedido(formData: any){
    return this.http.post<{ok: Boolean, pedido: Pedido}>(`${base_url}/pedidos`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE PEDIDO
  ==================================================================== */
  updatePedido(formData: any, id: string){
    return this.http.put<({ok: Boolean, pedido: Pedido})>(`${base_url}/pedidos/${id}`, formData, this.headers);
  }
  
  /** ================================================================
   *  UPDATE PEDIDO
  ==================================================================== */
  deletePedido(id: string){
    return this.http.delete<({ok: Boolean, msg: string})>(`${base_url}/pedidos/${id}`, this.headers);
  }
}
