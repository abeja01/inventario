export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Pizza' | 'Salchipapa' | 'Pasta' | 'Bebida' | 'Postre';
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit' | 'wastage' | 'adjustment';
  quantity: number;
  prevStock: number;
  newStock: number;
  date: Date;
  notes: string;
}
