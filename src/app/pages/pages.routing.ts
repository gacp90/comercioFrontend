import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// GUARDS
import { AuthGuard } from '../guards/auth.guard';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProductoComponent } from './producto/producto.component';
import { AdminGuard } from '../guards/admin.guard';
import { CategoriasComponent } from './categorias/categorias.component';
import { SubcategoriasComponent } from './subcategorias/subcategorias.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { FacturarComponent } from './facturar/facturar.component';
import { PedidoComponent } from './pedido/pedido.component';
import { FacturasComponent } from './facturas/facturas.component';
import { FacturaComponent } from './factura/factura.component';
import { MovimientosComponent } from './movimientos/movimientos.component';


// COMPONENTS

const routes: Routes = [
    
    { 
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children:
        [
          { path: '', component: PedidosComponent, data:{ title: 'Dashboard' } },
          { path: 'clientes', component: ClientesComponent, canActivate: [AdminGuard], data:{ title: 'Clientes' } },
          { path: 'categorias', component: CategoriasComponent, canActivate: [AdminGuard], data:{ title: 'Categorias' } },
          { path: 'facturar', component: FacturarComponent, canActivate: [AdminGuard], data:{ title: 'Facturación' } },
          { path: 'facturar/:client', component: FacturarComponent, canActivate: [AdminGuard], data:{ title: 'Facturación' } },
          { path: 'facturas', component: FacturasComponent, canActivate: [AdminGuard], data:{ title: 'Facturas' } },
          { path: 'factura/:id', component: FacturaComponent, canActivate: [AdminGuard], data:{ title: 'Factura' } },
          { path: 'subcategorias', component: SubcategoriasComponent, canActivate: [AdminGuard], data:{ title: 'Subcategorias' } },
          { path: 'pedidos', component: PedidosComponent, canActivate: [AdminGuard], data:{ title: 'Pedidos' } },
          { path: 'pedido/:id', component: PedidoComponent, canActivate: [AdminGuard], data:{ title: 'Pedido' } },
          { path: 'productos', component: ProductosComponent, canActivate: [AdminGuard], data:{ title: 'Productos' } },
          { path: 'producto/:id', component: ProductoComponent, canActivate: [AdminGuard], data:{ title: 'Producto' } },
          { path: 'movimientos', component: MovimientosComponent, canActivate: [AdminGuard], data:{ title: 'Movimientos de Productos' } },
          { path: 'perfil/:id', component: PerfilComponent, data:{ title: 'Perfil' } },
          { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard], data:{ title: 'Usuarios' } },
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ] 
      },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
