import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../cliente.service';
import {ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {ModalService} from './modal.service';
import {AuthService} from '../../usuarios/auth.service';
import {FacturasService} from '../../facturas/services/facturas.service';
import {Facturas} from '../../facturas/models/facturas';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})


export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;

  titulo = 'Carga de Imagen';
  private fotoSeleccionada: File;
  progreso: number = 0;




  constructor(private clienteService: ClienteService, public modalService: ModalService,
              public authService: AuthService, private facturasService: FacturasService) {
  }

  ngOnInit() {
    /*    this.activatedRoute.paramMap.subscribe(params => {
          const id = +params.get('id');

          if (id) {
            this.clienteService.getCliente(id).subscribe(cliente => {
              this.cliente = cliente;
            });
          }
        });*/
  }


  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal('Error de Seleccion', 'Debe seleccionar una foto valida', 'error');
      this.fotoSeleccionada = null;
    }
  }


  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal('Error de carga', 'Debe cargar una foto valida', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(
          event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progreso = Math.round((event.loaded / event.total) * 100);
            } else if (event.type === HttpEventType.Response) {
              let response: any = event.body;
              this.cliente = response.cliente as Cliente;

              this.modalService.notificarUpload.emit(this.cliente);

              swal('La foto se ha subido completamente', response.mensaje, 'success');
            }
            // this.cliente = cliente;
          }
        );
    }
  }


  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Facturas): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.facturasService.delete(factura.id).subscribe(
          () => {
            this.cliente.listaFacturas = this.cliente.listaFacturas.filter(fac => fac !== factura);
            swal(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} eliminada con éxito.`,
              'success'
            );
          }
        );
      }
    });
  }

}
