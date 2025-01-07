interface _nivel {
    activo: string,
    porcentaje: number
}

interface _hf {
    background: string,
    color: string
}

export class Empresa{
    constructor(
        public name: string,
        public logo: string,
        public logob: string,
        public address: string,
        public nit: string,
        public email: string,
        public codephone: string,
        public phone: string,
        public facebook: string,
        public instagram: string,
        public tiktok: string,
        public whatsapp: string,
        public ico: string,
        public sizeico: string,
        public marketing: boolean,
        public nivelone: _nivel,
        public niveltow: _nivel,
        public nivelthree: _nivel,
        public nivelfour: _nivel,
        public status: boolean,
        public footer: _hf,
        public header: _hf,
        public fecha: Date,
        public eid?: string,
        public _id?: string
    ){}
}