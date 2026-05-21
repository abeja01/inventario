import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private firebaseService = inject(FirebaseService);

  // Derivamos estados de los signals principales usando computed
  totalItems = computed(() => this.firebaseService.items().length);
  
  outOfStockItems = computed(() => 
    this.firebaseService.items().filter(item => item.quantity === 0).length
  );
  
  lowStockItems = computed(() => 
    this.firebaseService.items().filter(item => item.quantity > 0 && item.quantity <= 10).length
  );

  totalSuppliers = computed(() => this.firebaseService.suppliers().length);
}
