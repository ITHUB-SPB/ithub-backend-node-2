import type { Product } from './types.ts';

export const products: Product[] = [];
let nextId = 1;

export function getNextId(): number {
  return nextId++;
}