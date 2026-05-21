import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent {
  private firebaseService = inject(FirebaseService);

  categories = this.firebaseService.categories;

  newCategory = {
    name: ''
  };

  onSubmit() {
    if (this.newCategory.name.trim()) {
      this.firebaseService.addCategory({ ...this.newCategory });
      this.newCategory = { name: '' };
    }
  }

  onDelete(id: string | undefined) {
    if (id && confirm('¿Eliminar esta categoría?')) {
      this.firebaseService.deleteCategory(id);
    }
  }
}
