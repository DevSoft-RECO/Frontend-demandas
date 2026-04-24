import api from '@/api/axios';
import type { Agencia } from '@/types/agencia';

export const agenciaService = {
    async getAll(): Promise<Agencia[]> {
        const response = await api.get<Agencia[]>('/agencias');
        return response.data;
    }
};
