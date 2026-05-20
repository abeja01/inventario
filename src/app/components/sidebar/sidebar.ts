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
    { path: '/dashboard', label: 'Panel de Control', icon: 'dashboard' },
    { path: '/products', label: 'Productos', icon: 'restaurant_menu' },
    { path: '/transactions', label: 'Movimientos', icon: 'swap_horiz' }
  ];
}
