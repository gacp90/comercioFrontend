import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// MODULES
import { PagesRoutingModule } from './pages/pages.routing';
import { LoginRoutingModule } from './auth/auth.routing';

// COMPONENTS
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent }  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    LoginRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
