# Parcial 2 · Práctico — Evidencias (d = 7)

**Parámetros:** `m = 4`, `tope = 20`, `desde = 8`, `hasta = 9`, palabra = **gama**.

Repositorio: <https://github.com/JassDonado/parcial2fw.git>

## Tabla 2 · Casos de verificación

| Caso | Entrada | Resultado esperado | Observado |
|---|---|---|---|
| C1 | cantidad = 4 (m) | Sin errores | Sin errores |
| C2 | cantidad = 20 (tope) | Sin errores | Sin errores |
| C3 | cantidad = 24 (tope + m) | Error `max` | «La cantidad debe ser menor o igual a 20.» (sin `multiplo`) |
| C4 | cantidad = 5 (m + 1) | Error `multiplo` | «La cantidad debe ser múltiplo de 4.» |
| C5 | cantidad = 0 (límite inferior) | Error `min`; `multiplo` no falla | «La cantidad debe ser mayor o igual a 1.» (sin `multiplo`) |
| C6 | cantidad = 21 (tope + 1) | Errores `max` y `multiplo` | Ambos mensajes a la vez |
| G1 | desde = 8, hasta = 8 | Error `hastaMayor` en el grupo (igualdad) | «Hasta debe ser mayor que desde.» |
| G2 | desde = 8, hasta = 9 | Grupo válido | Sin errores |
| K1 | codigo = AB123 | Válido | Sin errores |
| K2 | codigo = ab123 | Error `pattern` | «El código debe tener dos letras mayúsculas y tres dígitos (AB123).» |
| K3 | codigo = AB12 | Error `pattern` | «El código debe tener dos letras mayúsculas y tres dígitos (AB123).» |
| T1 | AB123, cantidad = 20 | Dirección `/parcial2/detalle/AB123` · bloques 5 · margen 0 | `/parcial2/detalle/AB123?cantidad=20` · bloques 5 · margen 0 |
| T2 | CD456, cantidad = 8 | Dirección `/parcial2/detalle/CD456` · bloques 2 · margen 12 | `/parcial2/detalle/CD456?cantidad=8` · bloques 2 · margen 12 |
| T3 | Dirección `/parcial2/detalle/ab123` | Aviso de código inválido dentro del detalle; no es la vista 404 | Aviso «Código inválido» dentro del detalle (la vista 404 no se activa) |
| T4 | Dirección `/parcial2/otra` | Vista 404 | Vista 404 mostrando la dirección `/parcial2/otra` |

También se comprobó que al cargar el formulario no hay mensajes de error, que un campo
modificado muestra solo sus errores y que un envío inválido muestra todos los errores a la vez.

---

## R2 · Predicción de la búsqueda reactiva

Secuencia recibida por el campo (palabra **gama**): `0: ga`, `120: gam`, `200: gam `,
`800: gam`, `1000: GAM`, `1100: gam`, `2000: gama`.

Flujo: `debounceTime(300)` → `map(texto => texto.trim())` → `distinctUntilChanged()`.

### 2.1 Tabla de emisiones

| Instante (ms) | Valor emitido |
|---|---|
| 500 | `gam` |
| 2300 | `gama` |

**Total de emisiones: 2**

> La escritura de 0 a 200 ms no alcanza los 300 ms de silencio; a los 500 ms se emite
> `gam ` (recortado a `gam`). La escritura de 800 a 1100 ms vuelve a producir `gam`,
> que `distinctUntilChanged()` descarta por ser igual al valor emitido antes. A los
> 2300 ms se emite `gama`.

### 2.2 Lo que muestra la pantalla

`Último valor: gama` · `Emisiones: 2`, y el catálogo queda filtrado con 6 resultados.
**Coincide con la predicción 2.1.**

La ejecución real se midió en el navegador: las emisiones ocurrieron a los 525 ms
(`gam`, emisión 1) y 2320 ms (`gama`, emisión 2), dentro del margen del temporizador.

---

## R4 · Análisis de un defecto

Fila d = 7: `M = 4`, `TOPE = 20`. Caso T1: `cantidad = tope = 20`.

### 4.1 Valor y causa de cada `computed`

- **`margen` muestra `0`.** Causa: el valor llega como texto (`"20"`) desde el query param; la
  resta `TOPE - this.cantidad()` fuerza la conversión numérica, por lo que `20 - "20" = 0`.
  El resultado es correcto solo por casualidad, porque `-` sí convierte.
- **`siguiente` muestra `"204"`.** Causa: `input<number>` es solo una anotación de tipo y no
  convierte el valor; `this.cantidad() + M` concatena el texto `"20"` con `4` en lugar de
  sumar, dando `"204"`.

### 4.2 Línea corregida y verificación

```ts
siguiente = computed(() => Number(this.cantidad()) + M);
```

Verificación concreta: abrir `/parcial2/detalle/AB123?cantidad=20` y comprobar que
`siguiente` muestra **24** (antes mostraba `"204"`). Una prueba unitaria que espere `24`
para `cantidad = 20` y `M = 4` también lo habría detectado. Alternativa equivalente:
declarar el input con conversión, `cantidad = input(0, { transform: numberAttribute })`,
que es lo que hace este proyecto.

---

## R5 · Decisión propia

### 5.1 Tipo de formulario, reglas y alternativa

- **Tipo:** formularios reactivos (`ReactiveFormsModule` con `NonNullableFormBuilder`).
- **Regla 1 · `codigo`:** obligatorio y con patrón `^[A-Z]{2}\d{3}$` (dos letras mayúsculas y
  tres dígitos). Se declara en el `FormControl`, tipado y fácil de probar.
- **Regla 2 · `cantidad`:** rango 1–20 (`rangoValidator(1, 20)`) y múltiplo de 4
  (`multiploValidator(4)`); además, la regla de grupo `hastaMayorValidator` exige
  `hasta > desde`.
- **Con el otro tipo (template-driven):** las validaciones de control dependerían de
  directivas en la plantilla y la regla cruzada `hasta > desde` requeriría una directiva
  adicional o lógica en el componente; el modelo quedaría menos tipado y más difícil de
  probar de forma aislada.

### 5.2 Mecanismo, ventaja, costo y recarga

- **Mecanismo:** al enviar, `router.navigate(['/parcial2/detalle', codigo], { queryParams: { cantidad } })`;
  con `withComponentInputBinding()` el detalle recibe `codigo` y `cantidad` como `input()`
  (este último con `transform: numberAttribute`).
- **Ventaja:** el estado queda en la URL: el enlace es compartible y marcable, y no se
  necesita un servicio con estado mutable compartido.
- **Costo:** los datos quedan visibles y editables en la URL, por lo que el detalle debe
  validar y convertir los valores.
- **Al recargar con F5:** el detalle sigue mostrando el mismo código, cantidad, bloques y
  margen, porque los valores están en la URL y los `input()` se vuelven a enlazar con
  `withComponentInputBinding()`; no dependen de memoria del componente.

---

## R6 · Commits y capturas

| Commit | Mensaje |
|---|---|
| 1 | `parcial2: R1 formulario reactivo de solicitud y validadores propios` |
| 2 | `parcial2: R2 busqueda reactiva con debounce y listado filtrado` |
| 3 | `parcial2: R3 detalle con parametro de ruta, navegacion programatica y vista 404` |

Capturas solicitadas, en este orden:

1. `git log` con la hora de cada commit.
2. La aplicación en T1, con la dirección y los valores del detalle visibles.
3. La aplicación en T3, con el aviso «Código inválido» dentro del detalle.
