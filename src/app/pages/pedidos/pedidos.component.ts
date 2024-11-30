import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Pedido } from 'src/app/models/pedidos.model';
import { PedidosService } from 'src/app/services/pedidos.service';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';

interface _query{
  desde: number,
  hasta: number,
  sort: any,
  estado?: string
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  constructor(  private pedidosService: PedidosService,
                private searchService: SearchService) { }

  ngOnInit(): void {

    this.loadPedidos();
  }

  /** ======================================================================
   * LOAD PEDIDOS
  ====================================================================== */
  public pedidos: Pedido[] = [];
  public pedidosTemp: Pedido[] = [];
  public total: number = 0;
  public pendientes: number = 0;
  public enviandos: number = 0;
  public entregados: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;
  public query: _query = {
    desde: 0,
    hasta: 50,
    sort: {fecha: 1}
  }

  loadPedidos(){

    this.cargando = true;
    this.sinResultados = false;       

    this.pedidosService.loadPedidos(this.query)
        .subscribe( ({pedidos, total, pendientes, enviandos, entregados}) => {  
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (pedidos.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.pedidos = pedidos;
          this.pedidosTemp = pedidos;
          this.pendientes = pendientes;
          this.enviandos = enviandos;
          this.entregados = entregados;

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
    
    this.loadPedidos();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){  

    this.query.hasta = Number(cantidad);    
    this.loadPedidos();

  }

  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.query.desde}&hasta=${this.query.hasta}`;

    if (termino.length === 0) {
      this.pedidos = this.pedidosTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('pedidos', termino, query)
        .subscribe( ({resultados}) => {

          this.pedidos = resultados;
          this.resultados = resultados.length;

        });   

  }

  /** ======================================================================
   * SEARCH ESTADO
  ====================================================================== */
  searchEstado(estado: string){

    if (estado === 'total') {
      delete this.query.estado;
    }else{
      this.query.estado = estado;
    }
    
    this.loadPedidos();
  }

  /** ======================================================================
   * DELETE PEDIDO
  ====================================================================== */
  deletePedido(peid: string, i: any){

    Swal.fire({
      title: "Estas seguro?",
      text: "De eliminar este pedido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosService.deletePedido(peid)
        .subscribe( ({ok,msg}) => {

          if (ok) {
            this.pedidos.splice(i, 1);
            this.pedidosTemp.splice(i, 1);

            Swal.fire('Estupendo', 'Se ha eliminado el pedido exitosamente!', 'success');            
          }


        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })
      }
    });    

  };

}
