import api from '@/api/axios';
import type { Demanda } from '@/types/demanda';

export const demandaService = {
    async getAll(params?: { search?: string }): Promise<Demanda[]> {
        const response = await api.get<Demanda[]>('/demandas', { params });
        return response.data;
    },

    async getById(id: number): Promise<Demanda> {
        const response = await api.get<Demanda>(`/demandas/${id}`);
        return response.data;
    },

    async create(demanda: Demanda): Promise<Demanda> {
        const response = await api.post<Demanda>('/demandas', demanda);
        return response.data;
    },

    async update(id: number, demanda: Demanda): Promise<Demanda> {
        const response = await api.put<Demanda>(`/demandas/${id}`, demanda);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/demandas/${id}`);
    }
};
