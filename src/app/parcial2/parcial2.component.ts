import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DESDE, HASTA, M, PATRON_CODIGO, TOPE } from './parametros';
import { hastaMayorValidator, multiploValidator, rangoValidator } from './validadores';

type CampoNumerico = 'cantidad' | 'desde' | 'hasta';

@Component({
  selector: 'app-parcial2',
  imports: [ReactiveFormsModule],
  templateUrl: './parcial2.component.html',
  styleUrl: './parcial2.component.css',
})
export class Parcial2Component {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly M = M;
  readonly TOPE = TOPE;
  readonly DESDE = DESDE;
  readonly HASTA = HASTA;
  readonly patronCodigo = PATRON_CODIGO.source;

  /** Se activa al intentar enviar: obliga a mostrar todos los errores a la vez. */
  readonly enviado = signal(false);
  /** Confirma un envío válido. */
  readonly exito = signal(false);

  readonly formulario = this.fb.group(
    {
      codigo: this.fb.control('', [Validators.required, Validators.pattern(PATRON_CODIGO)]),
      cantidad: this.fb.control(M, [
        Validators.required,
        rangoValidator(1, TOPE),
        multiploValidator(M),
      ]),
      desde: this.fb.control(DESDE, [Validators.required]),
      hasta: this.fb.control(HASTA, [Validators.required]),
    },
    { validators: hastaMayorValidator },
  );

  /** Un error se muestra si el campo ya se tocó o se modificó, o si hubo un envío inválido. */
  mostrarError(campo: 'codigo' | CampoNumerico): boolean {
    const control = this.formulario.controls[campo];
    return this.enviado() || control.touched || control.dirty;
  }

  /** La regla de grupo se muestra al tocar cualquiera de los dos campos implicados. */
  mostrarErrorGrupo(): boolean {
    const { desde, hasta } = this.formulario.controls;
    return this.enviado() || desde.touched || desde.dirty || hasta.touched || hasta.dirty;
  }

  enviar(): void {
    this.exito.set(false);

    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.formulario.markAllAsTouched();
      return;
    }

    this.exito.set(true);
  }
}
