import api from '@/api/axios';
import type { Bufete } from '@/types/bufete';

export const bufeteService = {
    async getAll(): Promise<Bufete[]> {
        const response = await api.get<Bufete[]>('/bufetes');
        return response.data;
    },

    async create(bufete: Partial<Bufete>): Promise<Bufete> {
        const response = await api.post<Bufete>('/bufetes', bufete);
        return response.data;
    }
};
