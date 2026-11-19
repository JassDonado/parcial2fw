import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  templateUrl: './no-encontrado.component.html',
  styleUrl: './no-encontrado.component.css',
})
export class NoEncontradoComponent {
  private readonly router = inject(Router);

  /** URL solicitada que no coincidió con ninguna ruta. */
  readonly url = this.router.url;
}
