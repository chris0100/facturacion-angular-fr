import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  // El guarda aparece desde antes que aparezca el error, cuando se desea colocar el link en la ruta.
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Si esta autenticado, retorna true
    if (this.authService.isAuthenticated()) {

      // Revisa si ha expirado el token
      if (this.isTokenExpirado()) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    // Si no esta autenticado, redirecciona a la ventana de login.
    this.router.navigate(['/login']);
    console.log('no esta autenticado por el authguard');
    return false;
  }



  // Revisa si el token ha expirado
  isTokenExpirado(): boolean{
    let token = this.authService.token;
    let objPayload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000; // fecha actual en segundos

    if (objPayload.exp < now){
      return true;
    }
    return false;
  }

}
