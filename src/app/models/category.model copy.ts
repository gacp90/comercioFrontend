import { User } from "./users.model";

export class LogProduct{

    constructor(
        public sku: string,
        public name: string,
        public description: string,
        public type: string,
        public befored: number,
        public qty: number,
        public stock: number,
        public invoice: string,
        public cajero: User,
        public categoria: string,
        public subcategoria: string,
        public fecha: Date,

    ){}

}