import { Routes } from '@angular/router';
import { DetalleComponent } from './parcial2/detalle.component';
import { NoEncontradoComponent } from './parcial2/no-encontrado.component';
import { Parcial2Component } from './parcial2/parcial2.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'parcial2' },
  {
    path: 'parcial2',
    title: 'Parcial 2 · Solicitud',
    component: Parcial2Component,
  },
  {
    path: 'parcial2/detalle/:codigo',
    title: 'Parcial 2 · Detalle',
    component: DetalleComponent,
  },
  {
    path: '**',
    title: 'Parcial 2 · No encontrado',
    component: NoEncontradoComponent,
  },
];
