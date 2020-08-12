import { Component, OnInit } from '@angular/core';
import {FacturasService} from './services/facturas.service';
import {Facturas} from './models/facturas';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})


export class DetalleFacturaComponent implements OnInit {

  factura: Facturas;
  titulo = 'Factura';

  constructor(private facturasService: FacturasService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = +params.get('id');
      this.facturasService.getFactura(id).subscribe(
        factura => this.factura = factura
      );
    });
  }

}
