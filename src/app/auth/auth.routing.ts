import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';

// COMPONENTS

// COMPONENTS

const routes: Routes = [
    
    { path: 'login', component: LoginComponent, data:{ title: 'Login' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
