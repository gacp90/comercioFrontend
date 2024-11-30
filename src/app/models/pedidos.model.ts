import { Client } from "./clients.model";
import { Invoice } from "./invoices.model";
import { Product } from "./products.model";

interface _Items{
    sku: string;
    quantity: number;
    price: number;
    cost: number;
    product: Product;
    description: string;
}

export class Pedido{
    constructor(
        public pedido: number,
        public client: Client,
        public amount: number,
        public saldo: number,
        public items: _Items[],
        public estado: string,
        public status: boolean,
        public fecha: Date,
        public nota: string,
        public invoice: Invoice,
        public peid?: string,
        public _id?: string,
    ){}
}