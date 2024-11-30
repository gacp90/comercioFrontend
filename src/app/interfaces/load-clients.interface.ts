import { Client } from '../models/clients.model';

export interface LoadClients {
    ok: boolean,
    clients: Client[],
    total: number
}