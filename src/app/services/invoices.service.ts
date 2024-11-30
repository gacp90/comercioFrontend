import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Invoice } from '../models/invoices.model';

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

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
   *  LOAD INVOICES
  ==================================================================== */
  loadInvoices(query: any){
    return this.http.post<{ok: boolean, invoices: Invoice[], total: number}>( `${base_url}/invoices/query`, query, this.headers );
  }

  /** ================================================================
   *  LOAD INVOICE ID
  ==================================================================== */
  loadInvoiceId(id: string){
    return this.http.get<{ok: boolean, invoice: Invoice}>( `${base_url}/invoices/${id}`, this.headers );
  }

  /** ================================================================
   *  CREATE INVOICE
  ==================================================================== */
  createInvoice(formData: any){
    return this.http.post<{ok: Boolean, invoice: Invoice}>(`${base_url}/invoices`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE INVOICE
  ==================================================================== */
  updateInvoice(formData: any, id: string){
    return this.http.put<({ok: Boolean, invoice: Invoice})>(`${base_url}/invoices/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  RETURN INVOICE
  ==================================================================== */
  returnInvoice(formData: any, id: string){
    return this.http.put<({ok: Boolean, invoice: Invoice})>(`${base_url}/invoices/cancel/${id}`, formData, this.headers);
  }


}
