import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../services/firebase.service';
import { InventoryItem } from '../../../models/inventory-item.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent {
  private firebaseService = inject(FirebaseService);

  // Usamos el signal directamente del servicio
  items = this.firebaseService.items;

  onEdit(item: InventoryItem) {
    this.firebaseService.selectedItem.set(item);
  }

  onDelete(id: string | undefined) {
    if (id) {
      if(confirm('¿Estás seguro de eliminar este producto?')) {
        this.firebaseService.deleteItem(id);
      }
    }
  }
}
