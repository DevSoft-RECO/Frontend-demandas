import api from '@/api/axios';
import type { Demanda } from '@/types/demanda';

export interface PaginatedResponse<T> {
    total: number;
    page: number;
    limit: number;
    data: T[];
}

export const demandaService = {
    async getAll(params?: { search?: string, estado?: string, page?: number, limit?: number }): Promise<PaginatedResponse<Demanda>> {
        const response = await api.get<PaginatedResponse<Demanda>>('/demandas', { params });
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
    },

    async importCSV(file: File): Promise<{ status: string, message: string }> {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/demandas/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async exportCSV(): Promise<void> {
        const response = await api.get('/demandas/export', {
            responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Extraer nombre del archivo del header o usar uno por defecto
        const disposition = response.headers['content-disposition'];
        const filename = disposition
            ? disposition.split('filename=')[1]?.replace(/"/g, '')
            : 'demandas_export.csv';
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
