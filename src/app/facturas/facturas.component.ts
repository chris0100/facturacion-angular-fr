import { Component, OnInit } from '@angular/core';
import {Facturas} from './models/facturas';
import {ClienteService} from '../clientes/cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {flatMap, map, startWith} from 'rxjs/operators';
import {FacturasService} from './services/facturas.service';
import {Producto} from './models/producto';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ItemFactura} from './models/item-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo = 'Nueva Factura';
  factura: Facturas = new Facturas();

  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
              private facturasService: FacturasService, private router: Router) {
  }


  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(
      params => {
        // toma el parametro de la ruta y lo pasa a un clienteId
        const clienteId = +params.get('clienteId');

        // Obtiene el cliente y lo pasa a la factura
        this.clienteService.getCliente(clienteId).subscribe(
          cliente => this.factura.cliente = cliente
        );
      }
    );

    // Permanece atento a los cambios del campo de texto para filtar
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }


  // Funcion que filtra
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturasService.filtrarProductos(filterValue);
  }


  // Muestra el nombre en el campo de texto cuando se selecciona
  mostrarNombre(producto ?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }


  // Evento cuando se selecciona un producto
  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;
    console.log(producto);

    // Se revisa si el item existe
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    }

    else {
      // Se carga el producto seleccionado a un objeto de tipo ItemFactura.
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;

      // Se agrega a la lista de itemsFactura
      this.factura.listaItemFactura.push(nuevoItem);
    }


    // Se inicializa el valor en el campo de texto para que quede vacio
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }


  // Actualiza cantidades de producto
  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = event.target.value as number;

    // Si la cantidad es igual a cero
    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    // Itera sobre la lista para revisar cual id es compatible para asi cambiar cantidades.
    this.factura.listaItemFactura = this.factura.listaItemFactura.map( (item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }


  existeItem(id: number): boolean {
    let existe = false;
    this.factura.listaItemFactura.forEach((item: ItemFactura) => {
      if (id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }


  incrementaCantidad(id: number): void {
    this.factura.listaItemFactura = this.factura.listaItemFactura.map( (item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.listaItemFactura = this.factura.listaItemFactura.filter((item: ItemFactura) => id !== item.producto.id);
  }


  // Creacion de una factura
  create(facturaForm): void {
    console.log(this.factura);

    if (this.factura.listaItemFactura.length == 0) {
      this.autocompleteControl.setErrors({'invalid': true});
    }

    if (facturaForm.form.valid || this.factura.listaItemFactura.length > 0) {
      this.facturasService.create(this.factura).subscribe(factura => {
        swal(this.titulo, `Factura ${factura.descripcion} creada exitosamente`, 'success');
        this.router.navigate(['/facturas', factura.id]);
      });
    }


  }


}
