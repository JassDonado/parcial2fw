# Parcial 2 · Programación con Frameworks para Web

Avance **R1** del Parcial 2 · Práctico en Angular 22 (standalone, control flow moderno).
Parámetros del último dígito de la cédula **d = 7**:

| Parámetro | Fórmula | Valor |
|---|---|---|
| `m` | 2 + d mod 5 | **4** |
| `tope` | m × (4 + d mod 3) | **20** |
| `desde` | d + 1 | **8** |
| `hasta` | d + 2 | **9** |

## Ejecución

```bash
npm install
npx ng serve
```

Abrir `http://localhost:4200/parcial2`.

## R1 · Formulario reactivo

- Cuatro controles no nulos: `codigo`, `cantidad`, `desde` y `hasta`.
- Validadores propios en `src/app/parcial2/validadores.ts`:
  - `multiploValidator(4)`: la cantidad debe ser múltiplo de `m`.
  - `rangoValidator(1, 20)`: rango inclusivo con errores `min` y `max`.
  - `hastaMayorValidator`: regla de grupo `hasta > desde`.
- `codigo` usa `Validators.required` y el patrón `^[A-Z]{2}\d{3}$`.
- Cada error aparece bajo su campo cuando este se toca o se modifica; un envío inválido muestra todos los errores a la vez.

## Estructura

```
src/app/
├── app.config.ts
├── app.routes.ts
├── app.ts / app.html
└── parcial2/
    ├── parametros.ts
    ├── validadores.ts
    └── parcial2.component.ts|html|css
```
