import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryTransaction } from '../../models/product.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TransactionsComponent {
  protected readonly inventoryService = inject(InventoryService);

  // Search & Filter
  searchTerm = signal('');
  selectedType = signal<string>('Todos');

  // Filter options
  types = ['Todos', 'entry', 'exit', 'wastage', 'adjustment'];

  // Type label dictionary
  typeLabels: Record<string, string> = {
    'Todos': 'Todos los Tipos',
    'entry': 'Entrada (+)',
    'exit': 'Salida (-)',
    'wastage': 'Merma (-)',
    'adjustment': 'Ajuste (±)'
  };

  // Filtered transactions list
  filteredTransactions = computed(() => {
    let items = this.inventoryService.transactions();

    // 1. Type filter
    const type = this.selectedType();
    if (type !== 'Todos') {
      items = items.filter(t => t.type === type);
    }

    // 2. Search filter
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      items = items.filter(t => 
        t.productName.toLowerCase().includes(search) || 
        t.notes.toLowerCase().includes(search)
      );
    }

    return items;
  });
}
