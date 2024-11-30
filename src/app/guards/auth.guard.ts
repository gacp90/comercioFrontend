import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(  private usersService:UsersService,
    private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    
      return this.usersService.validateToken()
        .pipe(
          tap( isauthenticated => {
            if (!isauthenticated) {
              this.router.navigateByUrl('/login');
            }
          })
        );

  }
  
}
