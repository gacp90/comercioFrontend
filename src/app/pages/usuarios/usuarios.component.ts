import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// MODELS
import { User } from 'src/app/models/users.model';

// SERVICES
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  constructor(  private usersService: UsersService,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    // CARGAR USUARIOS
    this.loadUsers();

  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  public users: User[] = [];
  public total: number = 0;

  loadUsers(){

    this.usersService.loadUsers()
        .subscribe( ({users, total}) => {

          this.users = users;
          this.total = total;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

  }

  /** ======================================================================
   * CREATE USER
  ====================================================================== */
  @ViewChild('modalNewUser') modalNewUser!: ElementRef;

  public formNewSubmitted: boolean = false;
  public formNewUser = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['none', Validators.required]
  });

  createUser(){
       
    this.formNewSubmitted = true;   
    
    if (this.formNewUser.invalid) {
      return;
    }
    
    if (this.formNewUser.value.role === 'none') {
      return;      
    }
    
    this.usersService.createUser(this.formNewUser.value)
    .subscribe( ({user}) => {
      
      this.users.push(user);
      
      this.formNewUser.reset({
        role: 'none'
      });

      this.formNewSubmitted = false;
      
      Swal.fire('Estupendo', 'El nuevo usuario se creo con exito!', 'success');
      
      // // CERRAR MODAL 
      // // document.getElementById('add-user')?.classList.remove('show');
      // this.modalNewUser.nativeElement.classList.remove('show');      
      // let mod = document.querySelector('.modal-backdrop');
      // let del = mod?.parentNode;
      // del?.removeChild(mod!);

    }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

  }
  
  /** ======================================================================
   * VALIDATE FORM
  ====================================================================== */
  validate( campo: string): boolean{
    
    if ( this.formNewUser.get(campo)?.invalid && this.formNewSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }

  /** ======================================================================
   * DESACTIVAR O ACTIVAR USUARIOS
  ====================================================================== */
  desactiveUser(user: User){

    let texto;

    if (user.status) {
      texto = `desactivar`;
    }else{
      texto = `reactivar`;      
    }

    Swal.fire({
      title: 'Atención!',
      text: `Estas seguro de ${texto} este usuario`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Si, ${texto}`
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.usersService.deleteUser(user.uid!)
            .subscribe( ({user}) => {

              let respT;
              if (user.status) {
                respT = `activado`;
              }else{
                respT = `desactivado`;      
              }

              this.loadUsers();
              Swal.fire('Estupendo', `El usuario a sido ${respT} con exito!`)

            }, (err) => {
              console.log(err);
              Swal.fire('Error', err.error.msg, 'error');
              
            });

      }
    })

  }

  // FIN DE LA CLASE
}
