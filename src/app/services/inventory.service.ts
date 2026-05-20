import { Injectable, signal, computed } from '@angular/core';
import { Product, InventoryTransaction } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // In-memory products store initialized with seeded restaurant data
  private readonly _products = signal<Product[]>([
    {
      id: 'prod-1',
      name: 'Pizza Margherita Grande',
      description: 'Masa artesanal con salsa de pomodoro italiano, mozzarella fresca y hojas de albahaca orgánica con aceite de oliva virgen.',
      category: 'Pizza',
      price: 14.90,
      cost: 4.80,
      stock: 22,
      minStock: 8,
      unit: 'Unidad',
      imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-2',
      name: 'Pizza Pepperoni & Hot Honey',
      description: 'Combinación perfecta de pepperoni premium curado, mozzarella rallada, un toque de orégano y un chorreo de miel picante artesanal.',
      category: 'Pizza',
      price: 17.50,
      cost: 6.20,
      stock: 18,
      minStock: 8,
      unit: 'Unidad',
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-3',
      name: 'Salchipapa Suprema',
      description: 'Cama de papas nativas crujientes con salchicha ahumada premium, tocino crocante, queso cheddar fundido y huevo de corral frito.',
      category: 'Salchipapa',
      price: 12.00,
      cost: 4.50,
      stock: 6, // Low stock alert!
      minStock: 10,
      unit: 'Porción',
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-4',
      name: 'Salchipapa Clásica Andina',
      description: 'Papas fritas cortadas a mano al estilo rústico acompañadas de salchicha frankfurter alemana y variedad de cremas caseras.',
      category: 'Salchipapa',
      price: 8.50,
      cost: 2.80,
      stock: 35,
      minStock: 10,
      unit: 'Porción',
      imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-5',
      name: 'Fettuccine Alfredo con Pollo',
      description: 'Pasta fettuccine al dente envuelta en una aterciopelada salsa a base de crema de leche, parmesano madurado, mantequilla, pollo a la parrilla y champiñones.',
      category: 'Pasta',
      price: 16.90,
      cost: 5.50,
      stock: 14,
      minStock: 5,
      unit: 'Porción',
      imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-6',
      name: 'Lasaña Boloñesa Premium',
      description: 'Láminas de pasta fresca intercaladas con jugosa carne boloñesa cocinada a fuego lento por 4 horas, salsa bechamel sedosa y una costra dorada de queso mozzarella.',
      category: 'Pasta',
      price: 19.50,
      cost: 7.20,
      stock: 0, // Out of stock!
      minStock: 6,
      unit: 'Porción',
      imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-7',
      name: 'Jarra de Limonada de Hierbabuena',
      description: 'Refrescante jarra de 1.5 litros elaborada con limones frescos exprimidos al momento, hojas de hierbabuena fresca y hielo triturado.',
      category: 'Bebida',
      price: 7.00,
      cost: 1.50,
      stock: 30,
      minStock: 8,
      unit: 'Jarra',
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-8',
      name: 'Gaseosa Inka Cola 1.5L',
      description: 'Bebida gaseosa familiar helada perfecta para acompañar comidas típicas y compartir.',
      category: 'Bebida',
      price: 5.50,
      cost: 3.10,
      stock: 45,
      minStock: 12,
      unit: 'Unidad',
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    },
    {
      id: 'prod-9',
      name: 'Tiramisú al Caffè Espresso',
      description: 'Postre italiano artesanal con bizcochos soletilla empapados en café espresso italiano y licor Amaretto, cubiertos con crema suave de mascarpone y cacao.',
      category: 'Postre',
      price: 8.90,
      cost: 3.00,
      stock: 4, // Low stock alert!
      minStock: 5,
      unit: 'Porción',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      isActive: true
    }
  ]);

  // In-memory transactions store
  private readonly _transactions = signal<InventoryTransaction[]>([
    {
      id: 'tx-1',
      productId: 'prod-1',
      productName: 'Pizza Margherita Grande',
      type: 'entry',
      quantity: 30,
      prevStock: 0,
      newStock: 30,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      notes: 'Ingreso inicial de stock para el fin de semana.'
    },
    {
      id: 'tx-2',
      productId: 'prod-1',
      productName: 'Pizza Margherita Grande',
      type: 'exit',
      quantity: 8,
      prevStock: 30,
      newStock: 22,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      notes: 'Salida automática por ventas en salón.'
    },
    {
      id: 'tx-3',
      productId: 'prod-6',
      productName: 'Lasaña Boloñesa Premium',
      type: 'wastage',
      quantity: 2,
      prevStock: 2,
      newStock: 0,
      date: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      notes: 'Mermado por vencimiento de insumo fresco.'
    },
    {
      id: 'tx-4',
      productId: 'prod-3',
      productName: 'Salchipapa Suprema',
      type: 'exit',
      quantity: 12,
      prevStock: 18,
      newStock: 6,
      date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      notes: 'Consumo por orden de salón.'
    }
  ]);

  // Public readonly signals
  public readonly products = this._products.asReadonly();
  public readonly transactions = this._transactions.asReadonly();

  // Computed metrics for dashboard
  public readonly totalProductsCount = computed(() => this._products().length);

  public readonly totalStockCount = computed(() => 
    this._products().reduce((acc, curr) => acc + curr.stock, 0)
  );

  public readonly lowStockCount = computed(() => 
    this._products().filter(p => p.stock <= p.minStock && p.stock > 0).length
  );

  public readonly outOfStockCount = computed(() => 
    this._products().filter(p => p.stock === 0).length
  );

  public readonly totalInventoryCost = computed(() => 
    this._products().reduce((acc, curr) => acc + (curr.cost * curr.stock), 0)
  );

  public readonly totalInventoryValue = computed(() => 
    this._products().reduce((acc, curr) => acc + (curr.price * curr.stock), 0)
  );

  public readonly expectedProfit = computed(() => 
    this.totalInventoryValue() - this.totalInventoryCost()
  );

  // Category statistics
  public readonly categoryStats = computed(() => {
    const stats: Record<string, { count: number; stock: number; cost: number; value: number }> = {};
    
    this._products().forEach(p => {
      if (!stats[p.category]) {
        stats[p.category] = { count: 0, stock: 0, cost: 0, value: 0 };
      }
      stats[p.category].count += 1;
      stats[p.category].stock += p.stock;
      stats[p.category].cost += p.cost * p.stock;
      stats[p.category].value += p.price * p.stock;
    });

    return Object.entries(stats).map(([category, data]) => ({
      category,
      ...data
    }));
  });

  // Core Actions
  public addProduct(productData: Omit<Product, 'id' | 'isActive'>): void {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      isActive: true
    };

    // Add to products array
    this._products.update(prev => [...prev, newProduct]);

    // Create initial transaction if stock > 0
    if (newProduct.stock > 0) {
      const newTx: InventoryTransaction = {
        id: `tx-${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'entry',
        quantity: newProduct.stock,
        prevStock: 0,
        newStock: newProduct.stock,
        date: new Date(),
        notes: 'Ingreso inicial por registro de nuevo producto.'
      };
      this._transactions.update(prev => [newTx, ...prev]);
    }
  }

  public updateProduct(id: string, updatedFields: Partial<Product>): void {
    let oldStock = 0;
    let newStock = 0;
    let hasStockChange = false;
    let productName = '';

    this._products.update(prev => 
      prev.map(p => {
        if (p.id === id) {
          productName = p.name;
          oldStock = p.stock;
          newStock = updatedFields.stock !== undefined ? updatedFields.stock : p.stock;
          if (oldStock !== newStock) {
            hasStockChange = true;
          }
          return { ...p, ...updatedFields };
        }
        return p;
      })
    );

    // If there is an explicit stock adjustment, log it
    if (hasStockChange) {
      const diff = newStock - oldStock;
      const type = diff > 0 ? 'entry' : 'exit';
      const quantity = Math.abs(diff);

      const newTx: InventoryTransaction = {
        id: `tx-${Date.now()}`,
        productId: id,
        productName: updatedFields.name || productName,
        type: diff > 0 ? 'adjustment' : 'adjustment', // Keep simple
        quantity: quantity,
        prevStock: oldStock,
        newStock: newStock,
        date: new Date(),
        notes: `Ajuste manual de inventario (${oldStock} → ${newStock}).`
      };
      this._transactions.update(prev => [newTx, ...prev]);
    }
  }

  public deleteProduct(id: string): void {
    const product = this._products().find(p => p.id === id);
    if (!product) return;

    // Filter out product
    this._products.update(prev => prev.filter(p => p.id !== id));

    // Log deletion if there was stock
    if (product.stock > 0) {
      const newTx: InventoryTransaction = {
        id: `tx-${Date.now()}`,
        productId: id,
        productName: product.name,
        type: 'exit',
        quantity: product.stock,
        prevStock: product.stock,
        newStock: 0,
        date: new Date(),
        notes: `Eliminado del inventario. Stock remanente liquidado.`
      };
      this._transactions.update(prev => [newTx, ...prev]);
    }
  }

  public adjustStock(productId: string, type: 'entry' | 'exit' | 'wastage' | 'adjustment', quantity: number, notes: string): boolean {
    if (quantity <= 0) return false;

    let success = false;
    let oldStock = 0;
    let newStock = 0;
    let prodName = '';

    this._products.update(prev => 
      prev.map(p => {
        if (p.id === productId) {
          oldStock = p.stock;
          prodName = p.name;
          
          if (type === 'entry') {
            newStock = oldStock + quantity;
          } else {
            // Check if we have enough stock for exits or wastage
            if (oldStock < quantity) {
              // Cannot withdraw more than we have
              newStock = oldStock;
              return p; 
            }
            newStock = oldStock - quantity;
          }

          success = true;
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    if (success) {
      const newTx: InventoryTransaction = {
        id: `tx-${Date.now()}`,
        productId,
        productName: prodName,
        type,
        quantity,
        prevStock: oldStock,
        newStock,
        date: new Date(),
        notes: notes || (type === 'entry' ? 'Ingreso de mercadería' : type === 'exit' ? 'Salida por servicio' : 'Registro de merma/pérdida')
      };
      this._transactions.update(prev => [newTx, ...prev]);
    }

    return success;
  }
}
