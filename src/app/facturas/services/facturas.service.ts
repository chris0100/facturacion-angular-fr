import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Facturas} from '../models/facturas';
import {Producto} from '../models/producto';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class FacturasService {

  private urlEndPoint = 'http://localhost:8080/api/facturas';


  constructor(private http: HttpClient, private router: Router) { }


  // Obtener la factura por id
  getFactura(id: number): Observable<Facturas> {
    return this.http.get<Facturas>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(err => {
        if (err.status !== 401 && err.error.mensaje) {
          console.log('ingreso en un error: ' + err.status);
          this.router.navigate(['/clientes']);
        }
        return throwError(err);
      })
    );
  }


  // Eliminar por id
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }


  // Filtrar productos en busqueda
  filtrarProductos(term: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }


  // Crear una factura
  create(factura: Facturas): Observable<Facturas> {
    return this.http.post<Facturas>(this.urlEndPoint, factura);
  }






}
