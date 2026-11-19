import { Component, computed, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { M, PATRON_CODIGO, TOPE } from './parametros';

@Component({
  selector: 'app-detalle',
  imports: [RouterLink],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css',
})
export class DetalleComponent {
  /** Parámetro de ruta inyectado con withComponentInputBinding(). */
  readonly codigo = input.required<string>();
  /** Parámetro de consulta ?cantidad= convertido a número, no solo anotado como number. */
  readonly cantidad = input(0, { transform: numberAttribute });

  readonly M = M;
  readonly TOPE = TOPE;

  /** T3: un código con formato inválido se atiende aquí, no en la vista 404. */
  readonly codigoValido = computed(() => PATRON_CODIGO.test(this.codigo()));
  readonly cantidadValida = computed(
    () => Number.isFinite(this.cantidad()) && this.cantidad() >= 0,
  );
  readonly bloques = computed(() => Math.floor(this.cantidad() / M));
  readonly margen = computed(() => TOPE - this.cantidad());
}
