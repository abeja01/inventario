import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductsComponent } from './components/products/products';
import { TransactionsComponent } from './components/transactions/transactions';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: '**', redirectTo: 'dashboard' }
];

