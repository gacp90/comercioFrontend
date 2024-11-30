interface _notas{
    note: string,
    date: Date,
    staff: any
};

interface _img{
    img: string,
    _id?: string,
    date?: Date
};

export class Corrective {
    constructor(
        public control: string,
        public create: any,
        public product: any,
        public staff: any,
        public client: any,
        public notes: _notas[],
        public imgBef: _img[] = [],
        public imgAft: _img[],
        public description: string,
        public video: string,
        public red: boolean,
        public operativa: boolean,
        public items?: any[],
        public status?: boolean,
        public estado?: string,
        public checkin?: Date,
        public checkout?: Date,
        public date?: Date,
        public coid?: string,
        public solicitante?: string,
        public recibe?: boolean,
    ) {
        
    }

}