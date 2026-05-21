import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarComponent {
  navLinks = [
    { path: '/dashboard', label: 'Resumen', icon: 'dashboard' },
    { path: '/inventario', label: 'Inventario', icon: 'inventory_2' },
    { path: '/categorias', label: 'Categorías', icon: 'label' },
    { path: '/movimientos', label: 'Movimientos', icon: 'swap_horiz' },
    { path: '/proveedores', label: 'Proveedores', icon: 'local_shipping' }
  ];
}
