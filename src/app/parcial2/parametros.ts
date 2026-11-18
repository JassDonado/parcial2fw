/**
 * Parámetros del parcial para el último dígito de la cédula d = 7.
 *   m = 2 + d mod 5          -> 4
 *   tope = m * (4 + d mod 3) -> 20
 *   desde = d + 1            -> 8
 *   hasta = d + 2            -> 9
 */
export const M = 4;
export const TOPE = 20;
export const DESDE = 8;
export const HASTA = 9;

/** Dos letras mayúsculas y tres dígitos. */
export const PATRON_CODIGO = /^[A-Z]{2}\d{3}$/;
