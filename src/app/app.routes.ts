import { Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { CategoriesComponent } from './components/categories/categories.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inventario', component: InventoryComponent },
  { path: 'categorias', component: CategoriesComponent },
  { path: 'movimientos', component: TransactionsComponent },
  { path: 'proveedores', component: SuppliersComponent },
  { path: '**', redirectTo: 'dashboard' }
];

