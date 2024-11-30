import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { NgxPrinterService } from 'ngx-printer';

import { Pedido } from 'src/app/models/pedidos.model';
import { _Payments } from 'src/app/models/invoices.model';

import { Items } from 'src/app/interfaces/items.interface';
import { PedidosService } from 'src/app/services/pedidos.service';
import { InvoicesService } from 'src/app/services/invoices.service';

import { environment } from '../../../environments/environment';

interface _invoice{
  pedido: string,
  amount: number,
  vueltos: number,
  items: Items[],
  client?: string,
  payments?: _Payments[],
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  public empresa:any = environment.empresa;
  public menS: number = 0;
  public mayS: number = 0;

  constructor(  private activatedRoute: ActivatedRoute,
                private pedidosService: PedidosService,
                private invoicesService: InvoicesService,
                private printerService: NgxPrinterService) { 

    activatedRoute.params.subscribe( ({id}) => {
      this.loadPedido(id);      
    })

  }

  ngOnInit(): void {
  }

  /** ======================================================================
   * LOAD PEDIDO
  ====================================================================== */
  public pedido!: Pedido;
  loadPedido(id: string){

    this.pedidosService.loadPedidoID(id)
        .subscribe( ({pedido}) =>{

          if (pedido.amount < this.menS) {
            pedido.amount += 5000;
          }else if (pedido.amount - pedido.saldo < this.menS) {
            pedido.amount += 5000;
          }

          this.pedido = pedido;          

          if (pedido.saldo) {
            this.addPay(pedido.saldo, 'bono');
          }


        }, (err) =>{
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  PAGOS
  ==================================================================== */
  @ViewChild('montoP') montoP!: ElementRef;
  public restante: number = 0;
  public payments: _Payments[] = [];
  public totalPay: number = 0;
  
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
    
    this.restante = this.restante - this.pedido.amount;
    this.totalPay += monto;

    if (this.montoP) {
      this.montoP.nativeElement.value = '';      
      this.montoP.nativeElement.focus();
    }

  }

  delPay(pay: any){    

    this.payments.splice( pay, 1 );
    this.restante = 0;
    this.totalPay = 0;
    for (const pay of this.payments) {
      this.restante = this.restante + pay.monto;
      this.totalPay += pay.monto;
    }

    this.restante = this.restante - this.pedido.amount;
    this.montoP.nativeElement.onFocus = true;
    this.montoP.nativeElement.value = '';

  }

  /** ================================================================
  /** ================================================================
  /** ================================================================
   *  CREATE INVOICE
  ==================================================================== */
  public facturando: boolean = false;
  async createInvoice(){    

    this.facturando = true;

    const invoiceForm: _invoice = {
      pedido: this.pedido.peid!,
      client: this.pedido.client._id,
      amount: this.pedido.amount,
      items: this.pedido.items,
      payments: this.payments,
      vueltos: this.restante
    }

    if (this.pedido.amount < this.menS || (this.pedido.amount - this.pedido.saldo) < this.menS) {
      invoiceForm.items.push({        
        sku: 'Domicilio',
        quantity: 1,
        price: 5000,
        cost: 0,
        description: 'Domicilio'
      })
    }

    if (this.pedido.client.cedula !== '222222222222') {
      invoiceForm.client = this.pedido.client._id!
    }

    this.invoicesService.createInvoice(invoiceForm)
        .subscribe( ({invoice}) =>{     

          this.pedidosService.updatePedido( {invoice: invoice.iid, estado: 'Procesando'}, this.pedido.peid! )
              .subscribe( ({pedido}) => {

                this.facturando = false;
                this.payments = [];
                this.restante = 0;
                this.pedido.invoice = pedido.invoice;

                setTimeout( () => {
                  this.printTemplate();
                }, 2000);

              }, (err) => {
                console.log(err);
                Swal.fire('Error', err.error.msg, 'error')
                
              })

          Swal.fire('Estupendo', 'Se ha creado la factura exitosamente!', 'success');

        }, (err) => {
          this.facturando = false;
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  PRINT INVOICE
  ==================================================================== */
  @ViewChild('PrintTemplate') PrintTemplateTpl!: TemplateRef<any>;
  printTemplate() {
    this.printerService.printDiv('PrintTemplateTpl');
  }

  /** ================================================================
   *  CAMBIAR ESTADO DEL PEDIDO
  ==================================================================== */
  changeEstado(estado: string){

    this.pedidosService.updatePedido({estado}, this.pedido.peid!)
        .subscribe( ({pedido}) => {

          this.pedido.estado = pedido.estado;
          Swal.fire('Estupendo', 'Se ha cambiado el estado del pedido exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

}
