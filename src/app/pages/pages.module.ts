import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwiperModule } from 'swiper/angular';
import { NgxPrinterModule } from 'ngx-printer';

// MODULES
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductosComponent } from './productos/productos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { BreadcrumbsComponent } from '../shared/breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProductoComponent } from './producto/producto.component';
import { CardsComponent } from './dashboard/components/cards/cards.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { SubcategoriasComponent } from './subcategorias/subcategorias.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { FacturarComponent } from './facturar/facturar.component';
import { PedidoComponent } from './pedido/pedido.component';
import { FacturasComponent } from './facturas/facturas.component';
import { FacturaComponent } from './factura/factura.component';
import { MovimientosComponent } from './movimientos/movimientos.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProductosComponent,
    ClientesComponent,
    UsuariosComponent,
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbsComponent,
    SidebarComponent,
    PerfilComponent,
    ProductoComponent,
    CardsComponent,
    CategoriasComponent,
    SubcategoriasComponent,
    PedidosComponent,
    FacturarComponent,
    PedidoComponent,
    FacturasComponent,
    FacturaComponent,
    MovimientosComponent
  ],
  exports:[
    DashboardComponent,
    ProductosComponent,
    ClientesComponent,
    UsuariosComponent,
    PagesComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    SwiperModule,
    NgxPrinterModule.forRoot({printOpenWindow: true})
    
  ]
})
export class PagesModule { }
