import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador propio de control: exige que el valor sea múltiplo exacto de `multiplo`.
 * El cero es múltiplo de cualquier número, por lo que C5 no debe mostrar este error;
 * el límite inferior lo reporta `rangoValidator`.
 */
export function multiploValidator(multiplo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return { multiplo: { multiplo, actual: valor } };
    }

    return numero % multiplo === 0 ? null : { multiplo: { multiplo, actual: numero } };
  };
}

/**
 * Validador propio de control: rango inclusivo [minimo, maximo].
 * Devuelve las claves `min` y `max` por separado para que un valor pueda
 * incumplir ambas a la vez (C6: cantidad = tope + 1).
 */
export function rangoValidator(minimo: number, maximo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);
    const errores: ValidationErrors = {};

    if (!Number.isFinite(numero) || numero < minimo) {
      errores['min'] = { min: minimo, actual: valor };
    }

    if (!Number.isFinite(numero) || numero > maximo) {
      errores['max'] = { max: maximo, actual: valor };
    }

    return Object.keys(errores).length > 0 ? errores : null;
  };
}

/**
 * Validador propio de grupo: `hasta` debe ser estrictamente mayor que `desde`.
 * La igualdad (G1) también es inválida.
 */
export const hastaMayorValidator: ValidatorFn = (
  grupo: AbstractControl,
): ValidationErrors | null => {
  const desde = grupo.get('desde')?.value;
  const hasta = grupo.get('hasta')?.value;

  if (desde === null || hasta === null || desde === undefined || hasta === undefined) {
    return null;
  }

  if (desde === '' || hasta === '') {
    return null;
  }

  return Number(hasta) > Number(desde) ? null : { hastaMayor: { desde, hasta } };
};
