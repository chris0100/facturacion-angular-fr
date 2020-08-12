import {Injectable} from '@angular/core';
/*//import { DatePipe, formatDate } from '@angular/common';*/
import {Cliente} from './cliente';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';


import {Router} from '@angular/router';
import {Region} from './region';




@Injectable()
export class ClienteService {

  private urlEndPoint = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient, private router: Router) {
  }



  // Obtiene las regiones en lista
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }




  // Obtiene la lista de clientes que puede estar paginada
  getClientes(page: number): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),

      // Despues de que lo obtiene, lo mapea para convertir nombre y apellido en mayuscula.
      map((response: any) => {
          (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            /*          //let datePipe = new DatePipe('es');
                      //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
                      //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');*/
            return cliente;
          });
          return response;
        }
      ),

      // Tapea y muestra en consola el nombre
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  }




  // Para crear un cliente, envia el objeto cliente.
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status === 400) {
          return throwError(e);
        }

        if (e.error.mensaje){
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }




  // Obtener un cliente a traves de id
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }




  // Se actualiza el cliente a traves del id y de el objeto cliente
  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {

        if (e.status === 400) {
          return throwError(e);
        }

        if (e.error.mensaje){
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }



  // Eliminar un cliente a traves de un id
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        if (e.error.mensaje){
          console.error(e.error.mensaje);
        }

        return throwError(e);
      })
    );
  }



  // Cargar una foto a traves de un id y usando el archivo de la foto
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    // Crea el request con las respectivas propiedades
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    // Envia el request
    return this.http.request(req);
  }

}


