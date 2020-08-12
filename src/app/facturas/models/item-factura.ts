import {Producto} from './producto';

export class ItemFactura {
  producto: Producto;
  cantidad = 1;
  importe: number;

  public calcularImporte(): number {
    // @ts-ignore
    return this.cantidad * this.producto.precio;
  }
}



