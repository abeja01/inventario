export interface Transaction {
  id?: string;
  itemName: string;
  type: 'Entrada' | 'Salida';
  quantity: number;
  date: string;
}
