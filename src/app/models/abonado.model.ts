export class Abonado {

    constructor(
        public usuario: string,
        public name: string,
        public password: string,
        public clients: any[],
        public valid: boolean,
        public status: boolean,
        public fecha: Date,
        public aid: string
    ){}

}