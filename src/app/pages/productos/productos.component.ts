import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { SearchService } from '../../services/search.service';
import { SubcategoriasService } from 'src/app/services/subcategorias.service';
import { CategoriasService } from 'src/app/services/categorias.service';

// MODELS
import { Product } from '../../models/products.model';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';

// EXCEL
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: [
  ]
})
export class ProductosComponent implements OnInit {
  
  constructor(  private productsService: ProductsService,
                private searchService: SearchService,
                private categoriasService: CategoriasService,
                private subcategoriasService: SubcategoriasService,
                private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  /** ======================================================================
   * ASSIGN CLIENTS
  ====================================================================== */
  public productC!: Product;
  actualizarLista(){
    this.loadProducts();
  }

  /** ======================================================================
   * LOAD PRODUCTS
  ====================================================================== */
  public query: any = {
    desde: 0,
    hasta: 50,
    status: true
  }
  public products: Product[] = [];
  public productsTemp: Product[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  loadProducts(){

    this.cargando = true;
    this.sinResultados = false;       

    this.productsService.loadProducts(this.query)
        .subscribe( ({products, total}) => {  
          
          // COMPROBAR SI EXISTEN RESULTADOS
          if (products.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.products = products;
          this.productsTemp = products;

        });

  }

  /** ====================================================================
   * CREATE
  ====================================================================== */
  public savingNew: boolean = false;
  public newProductSubmitted: boolean = false;
  public newProductForm = this.fb.group({
    sku: ['', [Validators.required]],
    name: ['', [Validators.required]],
    type: ['', [Validators.required]],
    description: '',
    price: 0,
    wholesale: 0,
    vip: 0,
    cost: 0,
    stock: 0,
    min: 0,
    categoria: 'none',
    subcategoria: 'none',
    visibility: true
  });

  createProduct(){

    this.savingNew = true;
    this.newProductSubmitted = true;

    if (this.newProductForm.invalid) {
      this.savingNew = false;
      return;
    }
    
    if (this.newProductForm.value.categoria === 'none' || this.newProductForm.value.categoria === '' ) {
      Swal.fire('Atención', 'debes de seleccionar una categoria', 'warning')
      return;
    }
    if (this.newProductForm.value.subcategoria === 'none' || this.newProductForm.value.subcategoria === '' ) {
      Swal.fire('Atención', 'debes de seleccionar una subcategoria', 'warning')
      return;
    }

    this.productsService.createProduct( this.newProductForm.value )
        .subscribe( ({product}) => {

          this.products.push(product);
          this.total ++;
          this.newProductSubmitted = false;
          this.newProductForm.reset({
            categoria: 'none',
            subcategoria: 'none'
          });
          this.savingNew = false;

          Swal.fire('Estupendo', 'El producto se ha creado exitosamente!', 'success');

        }, (err) => { 
          Swal.fire('Error', err.error.msg, 'error');
          this.savingNew = false;          
        });

  }

  /** ======================================================================
   * VALIDATE FORM NEW
  ====================================================================== */
  validateNewForm( campo:string ): boolean{

    if ( this.newProductForm.get(campo)?.invalid && this.newProductSubmitted ) {      
      return true;
    }else{
      return false;
    }

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
    
    this.searchService.search('products', termino, query)
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
    
    this.loadProducts();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){  

    this.query.hasta = Number(cantidad);    
    this.loadProducts();

  }

  /** ================================================================
   *   LOAD CATEGORIES
  ==================================================================== */
  public categories: Category[] = [];
  loadCategories(){

    this.categoriasService.loadCategories({desde: 0, hasta: 1000})
        .subscribe( ({categories}) => {
          this.categories = categories;
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *   LOAD SUBCATEGORIES
  ==================================================================== */
  public subcategories: Subcategory[] = [];
  loadSubcategories(categoria: string){
    
    this.subcategoriasService.loadSubcategories({desde: 0, hasta: 1000, categoria})
      .subscribe( ({subcategories}) => {
          this.subcategories = subcategories;
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
      })
        
  }
      
  /** ================================================================
   *   LOAD CATEGORIES
  ==================================================================== */
  changeStatus(product: Product){

    let texto;

    if (product.status) {
      texto = `desactivar`;
    }else{
      texto = `reactivar`;      
    }

    Swal.fire({
      title: 'Atención!',
      text: `Estas seguro de ${texto} este producto`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Si, ${texto}`
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.productsService.changeStatus(product.pid!)
            .subscribe( ({product}) => {

              this.products.map( (prod) => {

                if (prod.pid === product.pid) {
                  prod.status = product.status;
                }

              });

            }, (err) => {
              console.log(err);
              Swal.fire('Error', err.error.msg, 'error');
              
            });

      }
    })

  }

  /** ================================================================
   *   IMPORTAR PRODUCTOS CON EXCEL
  ==================================================================== */
  public arrayExceltUpdate:any;
  public excelUpdate!:File;
  public totalItems: number = 0;
  public newProducts: any[] = [];
  public sendExcel: boolean = false;

  selectFileExcel(event: any){
    this.excelUpdate= event.target.files[0]; 
  }

  UploadExcel() {

    this.newProducts = [];

    if (!this.excelUpdate) {
      Swal.fire('Atención', 'No has seleccionado ningun archivo de excel', 'info');
      return;
    }

    this.sendExcel = true;

    let fileReader = new FileReader();
      fileReader.onload = (e) => {

          this.arrayExceltUpdate = fileReader.result;
          var data = new Uint8Array(this.arrayExceltUpdate);
          var arr = new Array();

          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          
          this.newProducts = XLSX.utils.sheet_to_json(worksheet,{raw:true});

          this.productsService.createProductExcel({products: this.newProducts})
              .subscribe( ({total}) => {

                this.loadProducts();
                Swal.fire('Estupendo', `Se crearon ${total} productos exitosamente!`, 'success');                
                this.sendExcel = false;

              }, (err) => {
                console.log(err);
                Swal.fire('Error', err.error.msg, 'error');                
              })
          

      }
      
      fileReader.readAsArrayBuffer(this.excelUpdate);
  };

  // FIN
}
