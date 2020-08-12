import {ItemFactura} from './item-factura';
import {Cliente} from '../../clientes/cliente';

export class Facturas {
  id: number;
  descripcion: string;
  observacion: string;
  listaItemFactura: Array<ItemFactura> = [];
  cliente: Cliente;
  total: number;
  createAt: string;


  calcularGranTotal(): number {
    this.total = 0;
    this.listaItemFactura.forEach((item: ItemFactura) => {
      this.total += item.calcularImporte();
    });

    return this.total;
  }
}
