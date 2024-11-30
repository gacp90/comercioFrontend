import { User } from 'src/app/models/users.model';

export interface LoadUsers {
    ok: boolean,
    users: User[],
    total: number
}