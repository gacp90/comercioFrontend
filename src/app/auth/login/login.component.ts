import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(  private router: Router,
                private fb: FormBuilder,
                private usersService: UsersService) { }

  ngOnInit(): void {
  }

  /** =============================================================
   * LOGIN
  =============================================================== */
  public formSubmitted: boolean = false;
  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '' , [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    remember: [false]
  });


  login(){

    this.formSubmitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }

    this.usersService.login(this.loginForm.value)
        .subscribe( resp => {            

          if (resp === false) {
            Swal.fire('Atención', 'Credenciales incorrectas, porfavor verificar el email o contraseña', 'warning')
            return;
          }          

          if ( this.loginForm.value.remember ) {
            localStorage.setItem('email', this.loginForm.value.email);
          }else {
            localStorage.removeItem('email');
          }

          // INGRESAR
          this.router.navigateByUrl('/');

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  /** =============================================================
   * VALIDAR CAMPOS
  =============================================================== */
  validate( campo: string): boolean{
    
    if ( this.loginForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }

  }


  // FIN DE LA CLASE
}
