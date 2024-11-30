import { Items } from "../interfaces/items.interface";
import { Client } from "./clients.model";
import { User } from "./users.model";


export interface _Payments{
    type: string,
    monto: number    
}

export class Invoice {

    constructor(
        public amount: number,
        public items: Items[],
        public client?: Client,
        public create?: User,
        public payments?: _Payments[],
        public status?: boolean,
        public fecha?: Date,
        public invoice?: number,
        public iid?: string,
        public _id?: string,
        public pago?: number,
        public vueltos?: number,
        public nota?: string,
    ){}

}