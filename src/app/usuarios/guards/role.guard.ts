import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Si no esta autenticado, retorna false(usuario invitado)
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      console.log('redirecciono porque no estaba autenticado');
      return false;
    }


    let role = next.data['role'] as string;
    console.log(role);

    // Si encuentra el role, retorna verdadero.
    if (this.authService.hasRole(role)) {
      return true;
    }


    // Retorna mensaje de error
    swal('Acceso denegado', `${this.authService.usuario.username}, no tienes acceso a este recurso`, 'warning');
    this.router.navigate(['/clientes']);
    return false;
  }
}
