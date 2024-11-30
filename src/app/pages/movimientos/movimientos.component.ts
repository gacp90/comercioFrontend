import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LogProduct } from 'src/app/models/category.model copy';
import { LogproductsService } from 'src/app/services/logproducts.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {

  constructor(  private searchService: SearchService,
                private logProductsService: LogproductsService) { }

  ngOnInit(): void {

    this.loadLogProducts();
  }

  /** ======================================================================
   * LOAD PRODUCTS
  ====================================================================== */
  public query: any = {
    desde: 0,
    hasta: 50,
    sort: {fecha:-1}
  }
  public products: LogProduct[] = [];
  public productsTemp: LogProduct[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  loadLogProducts(){

    this.cargando = true;
    this.sinResultados = false;       

    this.logProductsService.loadLogProducts(this.query)
        .subscribe( ({logproducts, total}) => {  
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (logproducts.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.products = logproducts;
          this.productsTemp = logproducts;

        });

  }

  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.query.desde}&hasta=${this.query.hasta}`;

    if (termino.length === 0) {
      this.products = this.productsTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('movimientos', termino, query)
        .subscribe( ({resultados}) => {

          this.products = resultados;
          this.resultados = resultados.length;

        });   

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
    
    this.loadLogProducts();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){  

    this.query.hasta = Number(cantidad);    
    this.loadLogProducts();

  }

}
