import { Corrective } from '../models/correctives.model';

export interface LoadCorrectives{
    ok: boolean,
    correctives: Corrective[],
    total: number
}