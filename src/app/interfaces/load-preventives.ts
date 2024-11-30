import { Preventive } from '../models/preventives.model';

export interface LoadPreventives{
    ok: boolean,
    total: number,
    preventives: Preventive[]
}