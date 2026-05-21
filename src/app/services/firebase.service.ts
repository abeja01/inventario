import { Injectable, signal, NgZone, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc,
  updateDoc
} from 'firebase/firestore';
import { InventoryItem } from '../models/inventory-item.model';
import { Supplier } from '../models/supplier.model';
import { Transaction } from '../models/transaction.model';
import { Category } from '../models/category.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db;
  private zone = inject(NgZone);
  
  // Signals
  items = signal<InventoryItem[]>([]);
  suppliers = signal<Supplier[]>([]);
  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  
  selectedItem = signal<InventoryItem | null>(null);

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
    this.listenToItems();
    this.listenToSuppliers();
    this.listenToTransactions();
    this.listenToCategories();
  }

  // ---- INVENTARIO ----
  private listenToItems() {
    const itemsCollection = collection(this.db, 'inventory');
    onSnapshot(itemsCollection, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InventoryItem[];
      this.zone.run(() => {
        this.items.set(data);
      });
    });
  }

  async addItem(item: InventoryItem) {
    try {
      const itemsCollection = collection(this.db, 'inventory');
      await addDoc(itemsCollection, item);
      this.addTransaction({ itemName: item.name, type: 'Entrada', quantity: item.quantity, date: new Date().toISOString() });
    } catch (error) { console.error("Error adding document: ", error); }
  }

  async updateItem(id: string, item: Partial<InventoryItem>) {
    try {
      const itemDoc = doc(this.db, 'inventory', id);
      await updateDoc(itemDoc, item);
      this.zone.run(() => {
        this.selectedItem.set(null); 
      });
      // Calculamos de forma simple que es una actualización (idealmente calcular la diferencia de stock, pero lo dejaremos simple)
      this.addTransaction({ itemName: item.name || 'Desconocido', type: 'Entrada', quantity: item.quantity || 0, date: new Date().toISOString() });
    } catch (error) { console.error("Error updating document: ", error); }
  }

  async deleteItem(id: string) {
    try {
      const itemDoc = doc(this.db, 'inventory', id);
      await deleteDoc(itemDoc);
      this.zone.run(() => {
        if (this.selectedItem()?.id === id) { this.selectedItem.set(null); }
      });
    } catch (error) { console.error("Error deleting document: ", error); }
  }

  // ---- PROVEEDORES ----
  private listenToSuppliers() {
    const suppliersCollection = collection(this.db, 'suppliers');
    onSnapshot(suppliersCollection, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Supplier[];
      this.zone.run(() => {
        this.suppliers.set(data);
      });
    });
  }

  async addSupplier(supplier: Supplier) {
    try {
      await addDoc(collection(this.db, 'suppliers'), supplier);
    } catch (error) { console.error("Error adding supplier: ", error); }
  }

  async deleteSupplier(id: string) {
    try {
      await deleteDoc(doc(this.db, 'suppliers', id));
    } catch (error) { console.error("Error deleting supplier: ", error); }
  }

  // ---- MOVIMIENTOS ----
  private listenToTransactions() {
    const txCollection = collection(this.db, 'transactions');
    onSnapshot(txCollection, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
      // Ordenamos por fecha más reciente
      this.zone.run(() => {
        this.transactions.set(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
    });
  }

  async addTransaction(tx: Transaction) {
    try {
      await addDoc(collection(this.db, 'transactions'), tx);
    } catch (error) { console.error("Error adding transaction: ", error); }
  }

  // ---- CATEGORIAS ----
  private listenToCategories() {
    const categoriesCollection = collection(this.db, 'categories');
    onSnapshot(categoriesCollection, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      this.zone.run(() => {
        this.categories.set(data);
      });
    });
  }

  async addCategory(category: Category) {
    try {
      await addDoc(collection(this.db, 'categories'), category);
    } catch (error) { console.error("Error adding category: ", error); }
  }

  async deleteCategory(id: string) {
    try {
      await deleteDoc(doc(this.db, 'categories', id));
    } catch (error) { console.error("Error deleting category: ", error); }
  }
}

