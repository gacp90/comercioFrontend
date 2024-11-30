import { Product } from '../models/products.model';

export interface LoadProducts{
    ok: boolean,
    products: Product[],
    total: number
}