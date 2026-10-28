export enum Category{
    Electronics = 'electronics',
    Clothing = 'clothing',
    Food = 'food',
    Other = 'other'
}

export interface Product {
    id: number;
    name: string;
    price: number;
    category: Category;
    stock: number;
    description?: string;
    imageUrl?: string;
    createdAt: string;
}

export const products: Product[] = [];
export let nextId = 1;

export const getNextId = () => {
    return nextId++;
}