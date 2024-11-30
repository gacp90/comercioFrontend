import { environment } from "../../environments/environment"

const base_url = environment.base_url;

export class User {

    constructor (
        public email: string,
        public role: 'ADMIN' | 'STAFF',
        public name?: string,
        public password?: string,
        public status?: boolean,
        public address?: string,
        public img?: string,
        public valid?: boolean,
        public fecha?: Date,
        public uid?: string,
    ){}

    /** ================================================================
    *   GET IMAGE
    ==================================================================== */    
    get getImage(){        
        
        if (this.img) {            
            return `${base_url}/uploads/user/${this.img}`;
        }else{
            return `${base_url}/uploads/user/no-image`;
        }
    }
    
}