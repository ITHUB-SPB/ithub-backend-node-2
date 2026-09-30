export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'electronics' | 'clothing' | 'food' | 'other';
  stock: number;
  desc: string;
  imageUrl?: string;
  createdAt: string;
}


export const products: Product[] = [
  {
    id: 1,
    name: "test",
    price: 100,
    category: "other", 
    stock: 10,
    desc: "desc-test",
    createdAt: new Date().toISOString()
  }
];