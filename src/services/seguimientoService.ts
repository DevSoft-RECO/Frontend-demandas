import api from '@/api/axios';
import type { Seguimiento, CreateTrackingRequest } from '@/types/seguimiento';

export const seguimientoService = {
    async getAll(): Promise<Seguimiento[]> {
        const response = await api.get<Seguimiento[]>('/seguimientos');
        return response.data;
    },

    async initialize(data: CreateTrackingRequest): Promise<Seguimiento> {
        const response = await api.post<Seguimiento>('/seguimientos', data);
        return response.data;
    }
};
