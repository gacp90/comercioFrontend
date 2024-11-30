import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { ProductsService } from 'src/app/services/products.service';
import { ClientsService } from 'src/app/services/clients.service';
import { SearchService } from 'src/app/services/search.service';
import { InvoicesService } from 'src/app/services/invoices.service';

// MODELS
import { Product } from 'src/app/models/products.model';
import { Client } from 'src/app/models/clients.model';

// INTERFACES
import { Items } from 'src/app/interfaces/items.interface';
import { Invoice, _Payments } from 'src/app/models/invoices.model';

import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

const local_url = environment.local_url;

interface _invoice{
  amount: number,
  vueltos: number,
  items: Items[],
  client?: string,
  payments?: _Payments[],
}

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css']
})
export class FacturarComponent implements OnInit {

  constructor(  private productsService: ProductsService,
                private clientsService: ClientsService,
                private activatedRoute: ActivatedRoute,
                private searchService: SearchService,
                private fb: FormBuilder,
                private invoicesService: InvoicesService) { 

                  // SI EXITE CLIENTE
                  activatedRoute.params.subscribe(({client}) => { if (client) this.loadClientRoute(client) })

                }

  ngOnInit(): void {

    this.client = {
      name: 'Consumidor Final',
      cedula: '222222222222',
      email: ''
    }

  }

  /** ================================================================
   *   LOAD CLIENT ROUTE
  ==================================================================== */
  loadClientRoute(cid: string){

    this.clientsService.loadClientById(cid)
        .subscribe( ({client}) => {

          this.selectClient(client);  

          if (client.carrito?.items.length! > 0) {
            for (const it of client.carrito?.items!) {
              this.addItem(it.product, it.qty, it.price)
            }
          }

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *   BUSCAR PRODUCTO POR CODIGO
  ==================================================================== */
  @ViewChild('search') search!: ElementRef;
  searchCode( sku: any ){

    if (sku.length === 0) {
      return;
    }

    this.productsService.loadProductCode(sku)
        .subscribe( ({product}) => {

          if (product === null || !product.status) {
            Swal.fire('No se encontro el producto', 'Verifica si el codigo de barras es correcto o si el producto a sido eliminado, he intenta de nuevo!', 'warning');
            return;
          }
          
          if(product.inventory <= 0){
            Swal.fire('Agotado', 'Este producto esta agotado', 'warning');
          }

          this.addItem(product, 1, product.price);
          this.search.nativeElement.value = '';
          this.search.nativeElement.onFocus = true;

        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
          console.log(err);
          
        })

  }

  /** ================================================================
   *   AGREGAR AL CARRITO DE COMPRAS
  ==================================================================== */
  public items: Items[] = [];
  addItem(product: Product, qty: number, price: number){

    const validarItem = this.items.findIndex( (item) => {
      if (item.sku === product.sku) {
        return true;
      }else{
        return false;
      }
    });

    // AGREGAMOS A LA LISTA DE ITEMS
    if (validarItem === -1) {      
      this.items.push({
        sku: product.sku,
        quantity: qty,
        price: price,
        cost: product.cost,
        description: product.name,
      })
    }else{
      this.items.map( (item) => {
        if (item.sku === product.sku) {
          item.quantity = (item.quantity + qty)
        }
      })
    }

    // SUMAR TOTALES
    this.sumarTotales();


  }

  /** ================================================================
   *   SUMAR TOTALES
  ==================================================================== */
  public total: number = 0;
  sumarTotales(){

    this.total = 0;

    for (const item of this.items) {
      this.total = this.total + (item.quantity * item.price);
    }

  }

  /** ================================================================
   *  PAGOS
  ==================================================================== */
  @ViewChild('montoP') montoP!: ElementRef;
  public restante: number = 0;
  public payments: _Payments[] = [];
  
  addPay(monto: any, type: string){

    monto = Number(monto);

    this.payments.push({
      type,
      monto
    });

    this.restante = 0;
    for (const pay of this.payments) {
      this.restante = this.restante + pay.monto;
    }

    this.restante = this.restante - this.total;

    this.montoP.nativeElement.onFocus = true;
    this.montoP.nativeElement.value = '';


  }

  delPay(pay: any){    

    this.payments.splice( pay, 1 );
    this.restante = 0;
    for (const pay of this.payments) {
      this.restante = this.restante + pay.monto;
    }

    this.restante = this.restante - this.total;
    this.montoP.nativeElement.onFocus = true;
    this.montoP.nativeElement.value = '';

  }

  /** ================================================================
  /** ================================================================
  /** ================================================================
   *   CLIENTS
  ==================================================================== */
  @ViewChild('searchC') searchC!: ElementRef;
  public listClients: Client[] = [];
  public client!: Client;

  searchClient(termino: string){

    if (termino.length === 0 || termino.length < 3) {
      this.listClients = [];
      return;
    }

    this.searchService.search('clients', termino)
        .subscribe( ({resultados}) => {
          
          this.listClients = resultados;

        }, (err) =>{
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  SELECT CLIENT
  ==================================================================== */
  selectClient(client: Client){

    this.client = client;
    this.listClients = [];
    this.searchC.nativeElement.value = '';

  }

  /** ================================================================
   *  CREATE CLIENTS
  ==================================================================== */
  public newClientSubmitted: boolean = false;
  public newClient = this.fb.group({
    name: ['', [Validators.required]],
    lastname: '',
    cedula: ['', [Validators.required]],
    phone: '',
    email: ['', [Validators.required]],
    address: '',
    city: '',
    department: '',
    party_type: 'PERSONA_NATURAL'
  })

  createClient(){

    this.newClientSubmitted = true;

    if (this.newClient.invalid) {
      return;
    }

    this.clientsService.createClient(this.newClient.value)
        .subscribe( ({ client }) => {

          this.client = client;
          this.newClientSubmitted = false;
          this.newClient.reset({
            party_type: 'PERSONA_NATURAL'
          });

          Swal.fire('Estupendo', 'Se ha creado el cliente correctamente', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  VALIDAR FORM
  ==================================================================== */
  validateClient(campo: string): boolean{

    if (this.newClientSubmitted && this.newClient.get(campo)?.invalid) {
      return true;    
    }else{
      return false;
    }

  }

  /** ================================================================
  /** ================================================================
  /** ================================================================
   *  CREATE INVOICE
  ==================================================================== */
  public facturando: boolean = false;
  createInvoice(){

    if (this.restante < 0) {
      Swal.fire('Atención', 'No ha cancelado el total de la factura', 'warning');
      return;
    }

    this.facturando = true;

    const invoice: _invoice = {
      amount: this.total,
      items: this.items,
      payments: this.payments,
      vueltos: this.restante
    }

    if (this.client.cedula !== '222222222222') {
      invoice.client = this.client.cid!
    }

    this.invoicesService.createInvoice(invoice)
        .subscribe( ({invoice}) =>{

          console.log(invoice);
          

          this.facturando = false;
          
          this.items = [];
          this.payments = [];
          this.restante = 0;
          this.sumarTotales();

          this.client = {
            name: 'Consumidor Final',
            cedula: '222222222222',
            email: '',
            address: '',
            phone: ''
          };

          Swal.fire('Estupendo', 'Se ha creado la factura exitosamente!', 'success');

          window.open(`${local_url}/dashboard/factura/${invoice.iid}`, '_blank');

        }, (err) => {
          this.facturando = false;
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })
    
    

  }


  // FIN DE LA CLASE
}
