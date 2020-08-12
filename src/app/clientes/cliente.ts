import {Region} from './region';
import {Facturas} from '../facturas/models/facturas';

export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  createAt: string;
  email: string;
  foto: string;
  region: Region;
  listaFacturas: Array<Facturas> = [];
}
