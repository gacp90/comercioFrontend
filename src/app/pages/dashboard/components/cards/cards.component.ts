import { Component, Input, OnInit } from '@angular/core';

// SERVICES
import { UsersService } from '../../../../services/users.service';
import { ClientsService } from '../../../../services/clients.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [
  ]
})
export class CardsComponent implements OnInit {

  @Input('coleccion') coleccion!: string;

  constructor(  private clientsService: ClientsService,
                private usersService: UsersService,) { }

  ngOnInit(): void {
    this.colection();    
  }

  /** ======================================================================
   * PARAM
  ====================================================================== */
  public total: number = 0;
  public color: string = 'bg-primary';
  public icon: string = 'mdi-alert-circle-outline';
  public title: string = 'Vacia';
  public ruta: string = '/';

  /** ======================================================================
   * COLECCION
  ====================================================================== */
  colection(){

    switch (this.coleccion) {
      case 'clientes':

        this.loadClients();
        
        break;

      case 'usuarios':
        this.loadUsers();
      break;
    
      default:
        break;
    }
    
  }

  /** ======================================================================
   * LOAD CLIENTS
  ====================================================================== */
  loadClients(){

    this.clientsService.loadClients(0,5)
        .subscribe( ({ total }) => {

          this.total = total;
          this.color = 'bg-primary';
          this.icon = 'mdi-account-multiple-outline';
          this.title = 'Clientes';
          this.ruta = 'clientes';

        })

  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  loadUsers(){

    this.usersService.loadUsers()
        .subscribe(({total}) => {

          this.total = total;
          this.color = 'bg-info';
          this.icon = 'mdi-account-box-outline';
          this.title = 'Usuarios';
          this.ruta = 'usuarios';

        });

  }


  // FIN DE LA CLASE
}
