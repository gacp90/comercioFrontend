import { Abonado } from "../models/abonado.model";

export interface LoadAbonados {
    ok: boolean,
    abonados: Abonado[],
    total: number
}