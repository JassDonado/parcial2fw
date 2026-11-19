import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { CatalogoService } from './catalogo.service';
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
  private readonly catalogo = inject(CatalogoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly M = M;
  readonly TOPE = TOPE;
  readonly DESDE = DESDE;
  readonly HASTA = HASTA;
  readonly patronCodigo = PATRON_CODIGO.source;

  /** Se activa al intentar enviar: obliga a mostrar todos los errores a la vez. */
  readonly enviado = signal(false);

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

  /** Campo «buscar»: flujo reactivo con debounce, recorte y descarte de repetidos. */
  readonly buscar = this.fb.control('');
  readonly ultimoValor = signal('');
  readonly emisiones = signal(0);
  readonly listadoFiltrado = computed(() => this.catalogo.filtrar(this.ultimoValor()));

  constructor() {
    this.buscar.valueChanges
      .pipe(
        debounceTime(300),
        map((texto) => texto.trim()),
        distinctUntilChanged(),
        tap(() => this.emisiones.update((total) => total + 1)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((valor) => this.ultimoValor.set(valor));
  }

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
    if (this.formulario.invalid) {
      this.enviado.set(true);
      this.formulario.markAllAsTouched();
      return;
    }

    const { codigo, cantidad } = this.formulario.getRawValue();
    void this.router.navigate(['/parcial2/detalle', codigo], {
      queryParams: { cantidad },
    });
  }
}
