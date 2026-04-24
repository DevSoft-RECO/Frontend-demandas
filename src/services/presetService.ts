import api from '@/api/axios';
import type { Preset } from '@/types/preset';

export const presetService = {
    async getAll(): Promise<Preset[]> {
        const response = await api.get<Preset[]>('/presets');
        return response.data;
    },

    async getById(id: number): Promise<Preset> {
        const response = await api.get<Preset>(`/presets/${id}`);
        return response.data;
    },

    async create(preset: Preset): Promise<Preset> {
        const response = await api.post<Preset>('/presets', preset);
        return response.data;
    },

    async update(id: number, preset: Preset): Promise<Preset> {
        const response = await api.put<Preset>(`/presets/${id}`, preset);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/presets/${id}`);
    }
};
