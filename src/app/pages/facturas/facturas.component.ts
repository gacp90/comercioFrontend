import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { Items } from 'src/app/interfaces/items.interface';
import { Invoice } from 'src/app/models/invoices.model';

// SERVICES
import { InvoicesService } from 'src/app/services/invoices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  constructor(  private invoicesService: InvoicesService,
                private printerService: NgxPrinterService
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  /** ================================================================
   *  PRINT CONSOLIDADO
  ==================================================================== */
  @ViewChild('PrintTemplate') PrintTemplateTpl!: TemplateRef<any>;
  printTemplate() {
    this.printerService.printDiv('PrintTemplateTpl');
  }

  /** ================================================================
   *  LOAD INVOICE
  ==================================================================== */
  public invoices: Invoice[] = [];
  public total: number = 0;
  public query = {
    desde: 0,
    hasta: 50,
    sort: {
      'fecha': -1
    }
  }

  loadInvoices(){

    this.invoicesService.loadInvoices(this.query)
        .subscribe( ({invoices, total}) => {

          this.invoices = invoices;         
          this.total = total;         

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg);
          
        })

  }

  /** ================================================================
   *   CAMBIAR PAGINA
  ==================================================================== */
  @ViewChild('mostrar') mostrar!: ElementRef;
  cambiarPagina (valor: number){
    
    this.query.desde += valor;

    if (this.query.desde < 0) {
      this.query.desde = 0;
    }
    
    this.loadInvoices();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){  

    this.query.hasta = Number(cantidad);    
    this.loadInvoices();

  }

  /** ================================================================
   *  CONSOLIDADO
  ==================================================================== */
  public facturasC: Invoice[] = [];
  public itemsC: any[] = [];  
  addFacturaC(factura: Invoice){

    const validarFactura = this.facturasC.findIndex( (fact) => {
      if (fact.iid === factura.iid) {
        return true;
      }else{
        return false;
      }
    });    

    // AGREGAMOS LA FACTURA AL CONSOLIDADO
    if (validarFactura !== -1) {      
      Swal.fire('Atención', 'esta factura ya se agrego al consolidado', 'warning');
      return;
    }

    this.facturasC.push(factura);
    
    for (const product of factura.items) {

      const validarItem = this.itemsC.findIndex( (item) => {
        if (item.sku === product.sku) {
          return true;
        }else{
          return false;
        }
      });

      // VERIFICAR SI EL PRODUCTO NO ES UN DOMICILIO
      if (product.description !== 'Domicilio') {
        
        // AGREGAMOS A LA LISTA DE ITEMS
        if (validarItem === -1) {      
          this.itemsC.push({
            sku: product.sku,
            quantity: product.quantity,
            description: product.description,
          })
        }else{
          this.itemsC.map( (item) => {
            if (item.sku === product.sku) {
              item.quantity = (item.quantity + product.quantity)
            }
          })
        }
      }
      
    }

    console.log(this.facturasC);
    console.log(this.itemsC);
    

  }

}
