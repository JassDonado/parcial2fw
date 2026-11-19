# Parcial 2 · Programación con Frameworks para Web

Aplicación Angular 22 (standalone, control flow moderno) del **Parcial 2 · Práctico**.
Parámetros del último dígito de la cédula **d = 7**:

| Parámetro | Fórmula | Valor |
|---|---|---|
| `m` | 2 + d mod 5 | **4** |
| `tope` | m × (4 + d mod 3) | **20** |
| `desde` | d + 1 | **8** |
| `hasta` | d + 2 | **9** |
| palabra | — | **gama** |

## Ejecución

```bash
npm install
npx ng serve
```

Abrir `http://localhost:4200/parcial2`.

Compilación de entrega:

```bash
npx ng build
```

## Funcionalidad

- **R1 · Formulario reactivo** (`/parcial2`): cuatro controles no nulos (`codigo`, `cantidad`, `desde`, `hasta`), validadores propios de control (`multiploValidator`, `rangoValidator`) y de grupo (`hastaMayorValidator`) en `src/app/parcial2/validadores.ts`. Los errores aparecen bajo cada campo tras tocarlo o modificarlo, y un envío inválido muestra todos a la vez.
- **R2 · Búsqueda reactiva**: `buscar` usa `debounceTime(300)`, `map(texto => texto.trim())` y `distinctUntilChanged()`, con contador de emisiones y último valor emitido. El catálogo se filtra de forma inmutable con ese último valor.
- **R3 · Ruta con parámetro** (`/parcial2/detalle/:codigo`): `withComponentInputBinding()` inyecta `codigo` y `cantidad` como `input()`; un envío válido navega con `router.navigate`. Un código con formato inválido muestra «Código inválido» dentro del detalle y cualquier otra dirección muestra la vista 404.

## Tabla A · Rutas

| Ruta | Componente | `title` | Descripción |
|---|---|---|---|
| `''` → `parcial2` | — (`pathMatch: 'full'`) | — | Redirección al formulario |
| `/parcial2` | `Parcial2Component` | `Parcial 2 · Solicitud` | Formulario validado + búsqueda y catálogo |
| `/parcial2/detalle/:codigo` | `DetalleComponent` | `Parcial 2 · Detalle` | Código, cantidad, bloques y margen |
| `**` | `NoEncontradoComponent` | `Parcial 2 · No encontrado` | Vista 404 con la URL solicitada |

Orden: la ruta de detalle va antes del comodín `**`; el comodín queda al final.

## Tabla B · Casos de verificación (observados)

| Caso | Entrada | Resultado esperado | Observado |
|---|---|---|---|
| C1 | cantidad = 4 (m) | Sin errores | Sin errores |
| C2 | cantidad = 20 (tope) | Sin errores | Sin errores |
| C3 | cantidad = 24 (tope + m) | Error `max` | «La cantidad debe ser menor o igual a 20.» |
| C4 | cantidad = 5 (m + 1) | Error `multiplo` | «La cantidad debe ser múltiplo de 4.» |
| C5 | cantidad = 0 | Error `min`; `multiplo` no falla | «La cantidad debe ser mayor o igual a 1.» (sin error de múltiplo) |
| C6 | cantidad = 21 (tope + 1) | Errores `max` y `multiplo` | Ambos mensajes a la vez |
| G1 | desde = 8, hasta = 8 | Error `hastaMayor` | «Hasta debe ser mayor que desde.» |
| G2 | desde = 8, hasta = 9 | Grupo válido | Sin errores |
| K1 | codigo = AB123 | Válido | Sin errores |
| K2 | codigo = ab123 | Error `pattern` | «El código debe tener dos letras mayúsculas y tres dígitos (AB123).» |
| K3 | codigo = AB12 | Error `pattern` | «El código debe tener dos letras mayúsculas y tres dígitos (AB123).» |
| T1 | AB123, cantidad = 20 | `/parcial2/detalle/AB123` · bloques 5 · margen 0 | `/parcial2/detalle/AB123?cantidad=20` · 5 · 0 |
| T2 | CD456, cantidad = 8 | `/parcial2/detalle/CD456` · bloques 2 · margen 12 | `/parcial2/detalle/CD456?cantidad=8` · 2 · 12 |
| T3 | `/parcial2/detalle/ab123` | «Código inválido» dentro del detalle | Aviso dentro del detalle (no es 404) |
| T4 | `/parcial2/otra` | Vista 404 | Vista 404 mostrando `/parcial2/otra` |

## Estructura

```
src/app/
├── app.config.ts          # provideRouter(routes, withComponentInputBinding())
├── app.routes.ts          # redirección, /parcial2, detalle y **
├── app.ts / app.html      # barra de navegación y <router-outlet />
└── parcial2/
    ├── parametros.ts      # m, tope, desde, hasta, palabra y patrón
    ├── validadores.ts     # validadores propios de control y de grupo
    ├── catalogo.service.ts
    ├── parcial2.component.ts|html|css
    ├── detalle.component.ts|html|css
    └── no-encontrado.component.ts|html|css
```

El análisis de las evidencias (predicción R2, defecto R4 y decisión R5) está en
[`docs/EVIDENCIAS_PARCIAL2.md`](docs/EVIDENCIAS_PARCIAL2.md).

## Commits

```
parcial2: R1 formulario reactivo de solicitud y validadores propios
parcial2: R2 busqueda reactiva con debounce y listado filtrado
parcial2: R3 detalle con parametro de ruta, navegacion programatica y vista 404
```
