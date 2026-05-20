import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductsComponent implements OnInit {
  protected readonly inventoryService = inject(InventoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Search, Filters & Sorting
  searchTerm = signal('');
  selectedCategory = signal<string>('Todos');
  sortBy = signal<'name' | 'stock-asc' | 'stock-desc' | 'price' | 'category'>('name');

  // Categories list
  categories = ['Todos', 'Pizza', 'Salchipapa', 'Pasta', 'Bebida', 'Postre'];

  // Form Modal signals
  isFormModalOpen = signal(false);
  formMode = signal<'add' | 'edit'>('add');
  selectedProductId = signal<string | null>(null);

  // Form fields
  formName = '';
  formDescription = '';
  formCategory: 'Pizza' | 'Salchipapa' | 'Pasta' | 'Bebida' | 'Postre' = 'Pizza';
  formPrice = 0;
  formCost = 0;
  formStock = 0;
  formMinStock = 0;
  formUnit = 'Unidad';
  formImageUrl = '';

  // Stock Adjustment Modal signals
  isStockModalOpen = signal(false);
  stockAdjustProductId = signal<string | null>(null);
  stockAdjustType: 'entry' | 'exit' | 'wastage' = 'entry';
  stockAdjustQuantity = 1;
  stockAdjustNotes = '';

  // Active product details for stock adjustment info
  selectedStockAdjustProduct = computed(() => {
    const id = this.stockAdjustProductId();
    return id ? this.inventoryService.products().find(p => p.id === id) || null : null;
  });

  // Filtered and Sorted products
  filteredProducts = computed(() => {
    let items = this.inventoryService.products();

    // 1. Category Filter
    const category = this.selectedCategory();
    if (category !== 'Todos') {
      items = items.filter(p => p.category === category);
    }

    // 2. Search Filter
    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      items = items.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }

    // 3. Sorting
    const sort = this.sortBy();
    return [...items].sort((a, b) => {
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sort === 'stock-asc') {
        return a.stock - b.stock;
      } else if (sort === 'stock-desc') {
        return b.stock - a.stock;
      } else if (sort === 'price') {
        return b.price - a.price;
      } else if (sort === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
  });

  ngOnInit(): void {
    // Read route query parameters (for dashboard links)
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const editStock = params['editStock'];

      if (id && editStock === 'true') {
        const product = this.inventoryService.products().find(p => p.id === id);
        if (product) {
          this.openStockModal(product.id);
        }
        
        // Clean URL parameters without reloading
        this.router.navigate([], {
          queryParams: { id: null, editStock: null },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  // --- Form Modal actions ---
  openAddModal(): void {
    this.formMode.set('add');
    this.selectedProductId.set(null);
    
    // Reset fields
    this.formName = '';
    this.formDescription = '';
    this.formCategory = 'Pizza';
    this.formPrice = 0;
    this.formCost = 0;
    this.formStock = 0;
    this.formMinStock = 5;
    this.formUnit = 'Unidad';
    this.formImageUrl = '';

    this.isFormModalOpen.set(true);
  }

  openEditModal(product: Product): void {
    this.formMode.set('edit');
    this.selectedProductId.set(product.id);

    // Populate fields
    this.formName = product.name;
    this.formDescription = product.description;
    this.formCategory = product.category;
    this.formPrice = product.price;
    this.formCost = product.cost;
    this.formStock = product.stock;
    this.formMinStock = product.minStock;
    this.formUnit = product.unit;
    this.formImageUrl = product.imageUrl || '';

    this.isFormModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
  }

  saveProduct(): void {
    if (!this.formName.trim()) return;

    // Fetch a sample image based on category if no URL is provided
    let imageUrl = this.formImageUrl.trim();
    if (!imageUrl) {
      if (this.formCategory === 'Pizza') imageUrl = 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500';
      else if (this.formCategory === 'Salchipapa') imageUrl = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500';
      else if (this.formCategory === 'Pasta') imageUrl = 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500';
      else if (this.formCategory === 'Bebida') imageUrl = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500';
      else imageUrl = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500';
    }

    const productData = {
      name: this.formName,
      description: this.formDescription,
      category: this.formCategory,
      price: this.formPrice,
      cost: this.formCost,
      stock: this.formStock,
      minStock: this.formMinStock,
      unit: this.formUnit,
      imageUrl
    };

    if (this.formMode() === 'add') {
      this.inventoryService.addProduct(productData);
    } else {
      const id = this.selectedProductId();
      if (id) {
        this.inventoryService.updateProduct(id, productData);
      }
    }

    this.closeFormModal();
  }

  deleteProduct(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este producto del inventario? Toda la información de stock y ventas de este item será retirada.')) {
      this.inventoryService.deleteProduct(id);
    }
  }

  // --- Stock Adjustment Modal actions ---
  openStockModal(productId: string): void {
    this.stockAdjustProductId.set(productId);
    this.stockAdjustType = 'entry';
    this.stockAdjustQuantity = 1;
    this.stockAdjustNotes = '';
    this.isStockModalOpen.set(true);
  }

  closeStockModal(): void {
    this.isStockModalOpen.set(false);
  }

  saveStockAdjustment(): void {
    const productId = this.stockAdjustProductId();
    if (!productId || this.stockAdjustQuantity <= 0) return;

    const success = this.inventoryService.adjustStock(
      productId,
      this.stockAdjustType,
      this.stockAdjustQuantity,
      this.stockAdjustNotes
    );

    if (success) {
      this.closeStockModal();
    } else {
      alert('Error: No se pudo procesar la transacción. Verifique que cuenta con stock suficiente.');
    }
  }
}
