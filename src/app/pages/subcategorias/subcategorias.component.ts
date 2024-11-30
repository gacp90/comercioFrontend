import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// MODELS
import { Category } from 'src/app/models/category.model';
import { Subcategory } from 'src/app/models/subcategory.model';

// SERVICES
import { CategoriasService } from 'src/app/services/categorias.service';
import { SubcategoriasService } from 'src/app/services/subcategorias.service';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.component.html',
  styles: [
  ]
})
export class SubcategoriasComponent implements OnInit {

  constructor(  private subcategoriasService: SubcategoriasService,
                private categoriasService: CategoriasService,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loadCategories();
    this.loadSubcategories();
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
  public query = {
    desde: 0,
    hasta: 1000
  }
  public subcategories: Subcategory[] = [];
  public total: number = 0;

  loadSubcategories(){

    this.subcategoriasService.loadSubcategories(this.query)
        .subscribe( ({subcategories, total}) => {
          this.subcategories = subcategories;
          this.total = total
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  CREATE SUBCATEGORY
  ==================================================================== */
  public formSubmitted: boolean = false;
  public createForm = this.fb.group({
    name: ['', [Validators.required]],
    categoria: 'none'
  });

  createCategory(){

    this.formSubmitted = true;

    if (this.createForm.invalid) {
      return;
    }

    if (this.createForm.value.categoria === 'none') {
      Swal.fire('Atención', 'Debes seleccionar una categoria', 'success');
      return;
    }

    this.subcategoriasService.createSubcategory(this.createForm.value)
        .subscribe( ({subcategory}) => {
          
          this.formSubmitted = false;
          this.createForm.reset();
          this.subcategories.push(subcategory);

          Swal.fire('Estupendo', 'Se ha creado la subcategoria exitosamente!', 'success');
          
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })


  }

  validate(campo: string): boolean {    
    if (this.createForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }    
  }

    /** ================================================================
   *  UPDATE SUBCATEGORY
  ==================================================================== */
  public subcategorySelect!: Subcategory;
  selectedSubategory(subcategory: Subcategory){

    this.subcategorySelect = subcategory;    

    this.updateForm.setValue({
      name: subcategory.name,
      categoria: subcategory.categoria._id!
    })

  }

  /** ================================================================
   *  UPDATE CATEGORY
  ==================================================================== */
  public updateFormSubmitted: boolean = false;
  public updateForm = this.fb.group({
    name: ['', [Validators.required]],
    categoria: 'none'
  })

  updateSubcategory(){

    this.updateFormSubmitted = true;

    if (this.updateForm.invalid) {
      return;
    }


    this.subcategoriasService.updateSubcategory(this.updateForm.value, this.subcategorySelect.subcaid!)
        .subscribe( ({subcategory}) => {

          this.updateFormSubmitted = false;
          this.subcategories.map( (subcat) => {
            if (subcat.subcaid === subcategory.subcaid) {
              subcat.name = subcategory.name;
              subcat.categoria = subcategory.categoria;
            }
          })

          Swal.fire('Estupendo', 'La subcategorias se a actualizado exitosamente', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })


  }

  validateUpdate(campo: string): boolean {
    
    if (this.updateForm.get(campo)?.invalid && this.updateFormSubmitted ) {
      return true;
    }else{
      return false;
    }
    
  }

  changeStatus( subcategory: Subcategory ){

    if (subcategory.status) {
      subcategory.status = false;
    }else{
      subcategory.status = true;
    }

    this.subcategoriasService.updateSubcategory( {status: subcategory.status}, subcategory.subcaid! )
        .subscribe( ({subcategory}) => {

          this.subcategories.map( (subcat) => {

            if (subcat.subcaid === subcategory.subcaid) {
              subcat.status = subcategory.status;
            }

          })

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  // FIN DE LA CLASE
}
