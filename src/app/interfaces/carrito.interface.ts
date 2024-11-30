import { Product } from "../models/products.model";

export interface _item{
    product: Product,
    qty: number,
    price: number
}

export interface Carrito{
    items: _item[],
    total: number
}