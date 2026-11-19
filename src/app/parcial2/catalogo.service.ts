import { Injectable, signal } from '@angular/core';

export interface Registro {
  codigo: string;
  nombre: string;
  categoria: string;
}

const REGISTROS: readonly Registro[] = [
  { codigo: 'AB123', nombre: 'Gama alta', categoria: 'Audio' },
  { codigo: 'CD456', nombre: 'Gama media', categoria: 'Video' },
  { codigo: 'EF789', nombre: 'Gama básica', categoria: 'Audio' },
  { codigo: 'GH012', nombre: 'Gama premium', categoria: 'Video' },
  { codigo: 'IJ345', nombre: 'Gama infantil', categoria: 'Accesorios' },
  { codigo: 'KL678', nombre: 'Gama portátil', categoria: 'Audio' },
  { codigo: 'MN901', nombre: 'Cable HDMI', categoria: 'Accesorios' },
  { codigo: 'OP234', nombre: 'Monitor 24 pulgadas', categoria: 'Video' },
  { codigo: 'QR567', nombre: 'Teclado mecánico', categoria: 'Accesorios' },
  { codigo: 'ST890', nombre: 'Parlante bluetooth', categoria: 'Audio' },
];

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly registros = signal<readonly Registro[]>(REGISTROS);

  readonly listado = this.registros.asReadonly();

  /** Filtro inmutable: no modifica el arreglo original. */
  filtrar(texto: string): readonly Registro[] {
    const consulta = texto.trim().toLowerCase();

    if (!consulta) {
      return this.registros();
    }

    return this.registros().filter((registro) =>
      `${registro.codigo} ${registro.nombre} ${registro.categoria}`.toLowerCase().includes(consulta),
    );
  }
}
