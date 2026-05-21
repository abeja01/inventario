import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.component.html'
})
export class SuppliersComponent {
  private firebaseService = inject(FirebaseService);

  suppliers = this.firebaseService.suppliers;

  newSupplier = {
    name: '',
    company: '',
    phone: '',
    productType: ''
  };

  onSubmit() {
    if (this.newSupplier.name && this.newSupplier.company) {
      this.firebaseService.addSupplier({ ...this.newSupplier });
      this.newSupplier = { name: '', company: '', phone: '', productType: '' };
    }
  }

  onDelete(id: string | undefined) {
    if (id && confirm('¿Eliminar este proveedor?')) {
      this.firebaseService.deleteSupplier(id);
    }
  }
}
