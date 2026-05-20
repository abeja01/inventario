import { Component, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardComponent {
  // Inject the inventory service
  protected readonly inventoryService = inject(InventoryService);

  // Expose the low stock products
  protected readonly lowStockProducts = () => 
    this.inventoryService.products().filter(p => p.stock <= p.minStock && p.stock > 0);

  // Expose out of stock products
  protected readonly outOfStockProducts = () => 
    this.inventoryService.products().filter(p => p.stock === 0);

  // Category visual configurations
  protected readonly categoryConfigs: Record<string, { icon: string; color: string; bg: string }> = {
    'Pizza': { icon: 'local_pizza', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    'Salchipapa': { icon: 'bakery_dining', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    'Pasta': { icon: 'dinner_dining', color: 'text-rose-400', bg: 'bg-rose-500/10' },
    'Bebida': { icon: 'local_bar', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    'Postre': { icon: 'cake', color: 'text-pink-400', bg: 'bg-pink-500/10' }
  };
}
