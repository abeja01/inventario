import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent {
  private firebaseService = inject(FirebaseService);

  transactions = this.firebaseService.transactions;
}
