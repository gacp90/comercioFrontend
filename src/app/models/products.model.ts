interface _img {
    img: string,
    fecha: Date
}

export class Product{

    constructor(
        public sku: string,
        public name: string,
        public type: string,
        public description: string,
        public price: number,
        public vip: number,
        public cost: number,
        public wholesale: number,
        public inventory: number,
        public stock: number,
        public bought: number,
        public sold: number,
        public returned: number,
        public damaged: number,
        public min: number,
        public offert: boolean,
        public offertPrice: number,
        public offertPercent: number,
        public taxes: boolean,
        public tax: any,
        public categoria: any,
        public subcategoria: any,
        public visibility: boolean,
        public status: boolean,
        public date: Date,
        public img: _img[],
        public pid?: string,
        public _id?: string,
    ) {}

}