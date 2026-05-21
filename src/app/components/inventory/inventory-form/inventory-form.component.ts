import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-form.component.html'
})
export class InventoryFormComponent {
  private firebaseService = inject(FirebaseService);

  // Exponemos el signal del item seleccionado para la vista
  selectedItem = this.firebaseService.selectedItem;
  
  // Exponemos las categorías dinámicas
  categories = this.firebaseService.categories;

  formData = {
    name: '',
    quantity: 0,
    price: 0,
    category: ''
  };

  constructor() {
    // Escuchamos cambios en el item seleccionado para llenar el formulario
    effect(() => {
      const item = this.selectedItem();
      if (item) {
        this.formData = { 
          name: item.name, 
          quantity: item.quantity, 
          price: item.price, 
          category: item.category 
        };
      } else {
        this.resetForm();
      }
    });
  }

  onSubmit() {
    if (this.formData.name && this.formData.quantity > 0) {
      const item = this.selectedItem();
      if (item && item.id) {
        // Actualizar
        this.firebaseService.updateItem(item.id, { ...this.formData });
      } else {
        // Agregar nuevo
        this.firebaseService.addItem({ ...this.formData });
      }
      this.resetForm();
    }
  }

  cancelEdit() {
    this.firebaseService.selectedItem.set(null);
  }

  private resetForm() {
    this.formData = { name: '', quantity: 0, price: 0, category: '' };
  }
}
