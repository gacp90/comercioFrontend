import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// MODELS
import { User } from 'src/app/models/users.model';

// SERVICE
import { UsersService } from '../../services/users.service';
import { SearchService } from 'src/app/services/search.service';
import { Product } from 'src/app/models/products.model';
import { TasksService } from 'src/app/services/tasks.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public user!: User;

  constructor(  private usersService: UsersService,
                private searchService: SearchService,
                private tasksService: TasksService,
                private fb: FormBuilder) { 
    
    // CARGAR USER
    this.user = usersService.user;
    
  }

  ngOnInit(): void {


    // CARGAR USUARIOS
    this.loadUsers();

  }

  /** ==============================================================================
   * CARGAR USUARIOS
  ================================================================================*/
  public users: User[] = [];
  loadUsers(){

    this.usersService.loadUsers()
        .subscribe( ({users}) => {

          users = users.filter(usuario => usuario.status === true );
          this.users = users;          

        }, (err) => {
          console.log(err);          
        })

  }

  /** ==============================================================================
   * BUSCAR PRODUCTOS
  ================================================================================*/
  public resultados: number = 0;
  public products: Product[] = [];
  search( termino:string ){

    let query = `desde=0&hasta=1000`;

    if (termino.length === 0) {
      this.products = [];
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('products', termino, query)
        .subscribe( ({resultados}) => {

          this.products = resultados;
          this.resultados = resultados.length;

        });   

  }

  /** ==============================================================================
   * CREAR TAREA
  ================================================================================*/
  @ViewChild('description') description!: ElementRef;
  public submittedTask: boolean = false;
  public formTask = this.fb.group({
    para: ['', [Validators.required]],
    description: '',
    address: ['', [Validators.required]],
    staff: ['', [Validators.required]],
  });

  createTask(){

    this.submittedTask = true;

    if (this.formTask.invalid) {
      return;
    }
    
    this.formTask.value.description = this.description.nativeElement.value;

    this.tasksService.createTask(this.formTask.value)
        .subscribe( ({task}) => {
          this.submittedTask = false;
          this.formTask.reset();
          this.formTask.value.description = '';
          Swal.fire('Estupendo', 'Se ha creado la tarea exitosamente', 'success');
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ==============================================================================
   * VALIDAR
  ================================================================================*/
  validate(campo: string): boolean{
    if (this.formTask.get(campo)?.invalid && this.submittedTask ) {
      return true;
    }else{
      return false;
    }
  }

  /** ==============================================================================
   * LOGOUT
  ================================================================================*/

  logout(){
    this.usersService.logout();
  }

}
