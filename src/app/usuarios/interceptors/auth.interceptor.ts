import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {

          // Si ha vencido el token, pero sigue autenticado por parte de angular
          // se debe cerrar por el metodo logout.
          if (this.authService.isAuthenticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }

        if (err.status === 403) {
          swal('Acceso denegado', `${this.authService.usuario.username}, no tienes acceso a este recurso`, 'warning');
          this.router.navigate(['/clientes']);
        }
        return throwError(err);
      })
    );
  }

}
