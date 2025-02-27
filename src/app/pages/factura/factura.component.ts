import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgxPrinterService } from 'ngx-printer';

// MODELS
import { _Payments, Invoice } from 'src/app/models/invoices.model';

// SERVICES
import { InvoicesService } from 'src/app/services/invoices.service';
import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  public empresa:any;

  constructor(  private activatedRoute: ActivatedRoute,
                private invoicesService: InvoicesService,
                private empresaService: EmpresaService,
                private printerService: NgxPrinterService) { 
    activatedRoute.params.subscribe( ({id}) =>{

      this.loadInvoice(id);
      
    })
  }

  ngOnInit(): void {  
    this.empresaService.loadEmpresa()
      .subscribe( ({empresa}) => {
        this.empresa = empresa;
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
   *  LOAD INVOICE
  ==================================================================== */
  public invoice!: Invoice;
  public saldo: number = 0;
  loadInvoice(id: string){

    this.invoicesService.loadInvoiceId(id)
        .subscribe( ({invoice}) => {

          this.invoice = invoice;
          this.restante = 0;
          for (const pay of this.invoice.payments!) {
            this.restante += pay.monto;
            this.totalPay += pay.monto;

            if (pay.type === 'bono') {
              this.saldo += pay.monto;
            }

          }

          this.restante -= this.invoice.amount;

        }, (err) => {
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
    
    this.restante = this.restante - this.invoice.amount;
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

    this.restante = this.restante - this.invoice.amount;
    this.montoP.nativeElement.onFocus = true;
    this.montoP.nativeElement.value = '';

  }

  /** ================================================================
   *  RETURN INVOICE
  ==================================================================== */
  returnInvoice( invoice: Invoice ){

    if (invoice.status) {
      Swal.fire({
        title: "Estas seguro?",
        text: "De cancelar esta factura!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, cancelar!"
      }).then((result) => {
        if (result.isConfirmed) {
          
          this.invoicesService.returnInvoice( {status: false}, invoice.iid! )
          .subscribe( ({invoice}) => {

            this.invoice.status = invoice.status;

          }, (err) => {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');            
          })

        }
      }); 
      
      

    }

  }

}
