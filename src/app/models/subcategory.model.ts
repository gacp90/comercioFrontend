import { Category } from "./category.model";

export class Subcategory{

    constructor(
        public name: string,
        public categoria: Category,
        public icon: string,
        public status: boolean,
        public fecha: Date,
        public subcaid?: string,
        public _id?: string,

    ){}

}