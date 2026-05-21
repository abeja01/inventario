import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, InventoryFormComponent, InventoryListComponent],
  templateUrl: './inventory.component.html'
})
export class InventoryComponent {
  // El contenedor principal solo orquesta los componentes hijos.
}
