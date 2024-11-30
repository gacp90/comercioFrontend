import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// MODELS
import { Category } from 'src/app/models/category.model';

// SERVICES
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styles: [
  ]
})
export class CategoriasComponent implements OnInit {

  constructor(  private categoriasService: CategoriasService,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    // CARGAR CATEGORIAS
    this.LoadCategories();

  }


  
  /**
   * The function "LoadCategories" loads categories from a service and assigns them to a variable,
   * while also handling any errors that may occur.
   */
  public query = {
    desde: 0,
    hasta: 50
  }
  public total: number = 0;
  public categories: Category[] = [];
  LoadCategories(){

    this.categoriasService.loadCategories(this.query)
        .subscribe( ({categories, total}) => {

          this.categories = categories;
          this.total = total;

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  CREATE CATEGORY
  ==================================================================== */

  public formSubmitted: boolean = false;
  public createForm = this.fb.group({
    name: ['', [Validators.required]]
  });

  createCategory(){

    this.formSubmitted = true;

    if (this.createForm.invalid) {
      return;
    }

    this.categoriasService.createCategory(this.createForm.value)
        .subscribe( ({category}) => {

          this.formSubmitted = false;
          this.createForm.reset();
          this.categories.push(category);

          Swal.fire('Estupendo', 'Se ha creado la categoria exitosamente!', 'success');
          
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
   *  UPDATE CATEGORY
  ==================================================================== */
  public categorySelect!: Category;
  selectedCategory(category: Category){

    this.categorySelect = category;

    this.updateForm.setValue({
      name: category.name
    })

  }

  /** ================================================================
   *  UPDATE CATEGORY
  ==================================================================== */
  public updateFormSubmitted: boolean = false;
  public updateForm = this.fb.group({
    name: ['', [Validators.required]]
  })

  updateCategory(){

    this.updateFormSubmitted = true;

    if (this.updateForm.invalid) {
      return;
    }


    this.categoriasService.updateCategory(this.updateForm.value, this.categorySelect.catid!)
        .subscribe( ({category}) => {

          this.updateFormSubmitted = false;
          this.categories.map( (cat) => {
            if (cat.catid! === category.catid) {
              cat.name = category.name;
            }
          })

          Swal.fire('Estupendo', 'La categorias se a actualizado exitosamente', 'success');

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

  changeStatus( category: Category ){

    if (category.status) {
      category.status = false;
    }else{
      category.status = true;
    }

    this.categoriasService.updateCategory( {status: category.status}, category.catid! )
        .subscribe( ({category}) => {

          this.categories.map( (cat) => {

            if (cat.catid! === category.catid) {
              cat.status = category.status;
            }

          })

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }


  // FIN DE LA CLASE
}
