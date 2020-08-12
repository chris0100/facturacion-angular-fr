import {Component, OnInit} from '@angular/core';
import {Usuario} from './usuario';
import swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})


export class LoginComponent implements OnInit {

  titulo = 'Por favor Sign In';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }


  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      swal('Login', `Hola ${this.authService.usuario.username}, ya se encuetran loguedo`, 'info');
      this.router.navigate(['/clientes']);
    }
  }


  login(): void {
    console.log(this.usuario);
    if (this.usuario.username === null || this.usuario.password === null) {
      swal('Error Login', 'Username o password vacios', 'error');
      return;
    }


    // Se llama al servicio para loguearse.
    this.authService.login(this.usuario).subscribe(
      response => {

        // Guardar el usuario
        this.authService.guardarUsuario(response.access_token);

        // Guardar el token
        this.authService.guardarToken(response.access_token);

        // Se crea la variable usuario
        const usuario = this.authService.usuario;

        // Redirecciona con mensaje de exito
        this.router.navigate(['/clientes']);
        swal('Login', `Hola ${usuario.username}, has iniciado sesion con exito!`, 'success');
      },
      error => {
        if (error.status === 400) {
          swal('Error Login', 'Username o password incorrectos', 'error');
        }
      }
    );

  }

}
