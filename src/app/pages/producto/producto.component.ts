import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import SwiperCore, { FreeMode, Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade } from 'swiper';
// install Swiper modules
SwiperCore.use([FreeMode, Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]);

// MODELS
import { Product } from 'src/app/models/products.model';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { SubcategoriasService } from 'src/app/services/subcategorias.service';
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private productsService: ProductsService,
                private router: Router,
                private fb: FormBuilder,
                private categoriasService: CategoriasService,
                private subcategoriasService: SubcategoriasService,
                private fileUploadService: FileUploadService) {}

  ngOnInit(): void {

    // LOAD CATEGORIES
    this.loadCategories();

    this.loadProduct();


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
   *  LOAD PRODUCT ID
  ==================================================================== */
  public product: Product | any;
  public portada: string = 'none';

  loadProduct(){

    this.activatedRoute.params
        .subscribe( ({id}) =>  {      
        

          this.productsService.loadProductId(id)
              .subscribe( ({product}) => {                

                this.product = product;

                if (product.img.length > 0) {
                  this.portada = this.product.img.img;
                }
                

                if (product.categoria) {
                  this.loadSubcategories(product.categoria.catid!);                  
                }

                this.updateForm.setValue({
                  sku: this.product.sku,
                  name: this.product.name,
                  type: this.product.type,
                  description: this.product.description || '',
                  price: this.product.price,
                  wholesale: this.product.wholesale || 0,
                  vip: this.product.vip || 0,
                  cost: this.product.cost,
                  min: this.product.min,
                  categoria: (this.product.categoria)? this.product.categoria._id : 'none',
                  subcategoria: (this.product.subcategoria)? this.product.subcategoria._id : 'none',
                  visibility: this.product.visibility,
                  offert: this.product.offert || false,
                  offertPrice: this.product.offertPrice || 0,
                  offertPercent: this.product.offertPercent || 0
                })
                

              }, (err) => {
                Swal.fire('Error', err.error.msg, 'error');
                this.router.navigateByUrl('/');
                
              });

      });

  }

  /** ================================================================
   *  CALCULAR PORCENTAJE DE LA OFERTA
  ==================================================================== */
  calculatePercent(price: any){
    price = Number(price);

    let percent = ((this.product.price - price )/ this.product.price ) * 100;

    this.updateForm.setValue({
      sku: this.updateForm.value.sku,
      name: this.updateForm.value.name,
      type: this.updateForm.value.type,
      description: this.updateForm.value.description,
      price: this.updateForm.value.price,
      wholesale: this.updateForm.value.wholesale,
      vip: this.updateForm.value.vip,
      cost: this.updateForm.value.cost,
      min: this.updateForm.value.min,
      categoria: this.updateForm.value.categoria,
      subcategoria: this.updateForm.value.subcategoria,
      visibility: this.updateForm.value.visibility,
      offert: this.updateForm.value.offert,
      offertPrice: this.updateForm.value.offertPrice || 0,
      offertPercent: percent.toFixed(0)
    })

  }

  /** ================================================================
   *  UPDATE PRODUCT
  ==================================================================== */
  public formSubmitted: boolean = false;
  public updateForm = this.fb.group({
    sku: ['', [Validators.required]],
    name: ['', [Validators.required]],
    type: 'Unidad',
    description: '',
    price: 0,
    wholesale: 0,
    vip: 0,
    cost: 0,
    min: 0,
    categoria: 'none',
    subcategoria: 'none',
    visibility: true,
    offert: false,
    offertPrice: 0,
    offertPercent: 0
  })

  update(){

    this.formSubmitted = true;
    
    if (this.updateForm.invalid) {      
      this.formSubmitted = false;
      return;
    }

    if (this.updateForm.value.categoria === 'none' || this.updateForm.value.categoria === '' ) {
      Swal.fire('Atención', 'debes de seleccionar una categoria', 'warning')
      return;
    }

    if (this.updateForm.value.subcategoria === 'none' || this.updateForm.value.subcategoria === '' ) {
      Swal.fire('Atención', 'debes de seleccionar una subcategoria', 'warning')
      return;
    }

    this.productsService.updateProduct( this.updateForm.value, this.product.pid! )
        .subscribe( ({product}) => {

          this.product = product;
          Swal.fire('Estupendo', 'El producto se ha actualizado exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })


  }

  /** ================================================================
   *  VALIDATE FORM
  ==================================================================== */
  validate(campo: string): boolean{

    if (this.updateForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }
  }

  /** ================================================================
   *  UPDATE INVENTORY PRODUCT
  ==================================================================== */
  public upInventorySubmmited: boolean = false;
  public upInventoryForm = this.fb.group({
    qty: [0, [Validators.required, Validators.min(0)]],
    sku: '',
    movimiento: 'Agregados'
  })
  
  updateInventory(){
    
    this.upInventorySubmmited = true;

    if (this.upInventoryForm.invalid || this.upInventoryForm.value.qty <= 0) {
      return;
    }

    this.upInventoryForm.value.sku = this.product.sku;  

    this.productsService.updateProduct(this.upInventoryForm.value, this.product.pid)
        .subscribe( ({product}) => {

          this.product = product;

          this.upInventorySubmmited = false;
          this.upInventoryForm.reset({
            movimiento: 'Agregados'
          });
          Swal.fire('Estupendo', 'Se ha actualizado el inventario exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  VALIDATE UPDATE INVENTORY FORM
  ==================================================================== */
  validateUpInv(campo: string): boolean{

    if (this.upInventoryForm.get(campo)?.invalid && this.upInventorySubmmited ) {
      return true;
    }else{
      return false;
    }
  }

  /** ================================================================
   *  CHANGE STATUS
  ==================================================================== */
  changeStatus(status: boolean){

    if (status) {
      status = false;
    }else{
      status = true;      
    }

    this.productsService.updateProduct({sku: this.product.sku, status}, this.product.pid!)
        .subscribe( ({product}) => {

          this.product.status = product.status;
          Swal.fire('Estupendo', ' Se ha actualizdo el estado del producto exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
        })

  }

  /** ================================================================
   *   ACTUALIZAR IMAGEN
  ==================================================================== */
  public imgTempP: any = null;
  public subirImagen!: any;
  cambiarImage(file: any): any{  
    
    this.subirImagen = file.target.files[0];
    
    if (!this.subirImagen) { return this.imgTempP = null }    
    
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file.target.files[0]);
        
    reader.onloadend = () => {
      this.imgTempP = reader.result;      
    }

  }

  /** ================================================================
   *  SUBIR IMAGEN
  ==================================================================== */
  @ViewChild('fileImg') fileImg!: ElementRef;
  public imgPerfil: string = 'no-image';
  subirImg(){
    
    this.fileUploadService.updateImage( this.subirImagen, 'products', this.product.pid)
    .then( 
      (resp:{ date: Date, nombreArchivo: string, ok: boolean }) => {
        
        this.product.img.push({
          img: resp.nombreArchivo,
          fecha: resp.date
        })
      }
    );
    
    this.fileImg.nativeElement.value = '';
    this.imgTempP = null;
    
  }

  /** ================================================================
   *  ELIMINAR IMAGEN
  ==================================================================== */
  deleImg(img: string){

    this.fileUploadService.deleteFile(img, this.product.pid, 'products')
        .subscribe( (resp: {product: Product}) => {
          
          this.product.img = resp.product.img;
          Swal.fire('Estupendo', 'Se ha eliminado la imagen exitosamente!', 'success');
          
        }, (err)  => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        });

  }

  /** ================================================================
   *  ADD VIDEO
  ==================================================================== */
  @ViewChild ('linkI') linkI!:ElementRef;
  addVideo(video: string){

    video = video.trim();

    this.product.videos.push({
      video,
      fecha: new Date()
    })

    this.productsService.updateProduct({videos: this.product.videos, sku: this.product.sku}, this.product.pid)
        .subscribe( ({product}) => {

          this.linkI.nativeElement.value = '';

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
        })


  }

  /** ================================================================
   *  DELETE VIDEO
  ==================================================================== */
  delVideo(i: any){

    this.product.videos.splice(i,1);

    this.productsService.updateProduct({videos: this.product.videos, sku: this.product.sku}, this.product.pid)
        .subscribe( ({product}) => {
          
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
        })

  }


  /** ================================================================
   *  CONFIG SWIPER
  ==================================================================== */
  public config = {
    slidesPerView:1,
    spaceBetween:10,
    centeredSlides: true,
    navigation: true,
    pagination: { clickable: true, dynamicBullets: true },
    breakpoints:{
      '450': {
        slidesPerView: 2,
        spaceBetween: 20,
        centeredSlides: false,
      },
      '640': {
        slidesPerView: 3,
        spaceBetween: 30,
        centeredSlides: false,
      },
      '768': {
        slidesPerView: 3,
        spaceBetween: 40,
        centeredSlides: false,
      },
    }

  }

  
  // FIN DE LA CLASE
}
