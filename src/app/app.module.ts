import {LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import localEs from '@angular/common/locales/es-CO'
import { registerLocaleData } from '@angular/common'

registerLocaleData(localEs, 'es-CO');

// MODULES
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { PipesModule } from './pipes/pipes.module';

//COMPONENTS
import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';


@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    PipesModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
