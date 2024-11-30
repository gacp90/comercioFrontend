import { User } from "./users.model";

export class Task{

    constructor(
        public para: string,
        public description: string,
        public address: string,
        public create: User,
        public staff: User,
        public status: boolean,
        public end: boolean,
        public fecha: Date,
        public fechaend?: Date,
        public taskid?: string,
        public _id?: string,

    ){}

}