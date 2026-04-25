import api from '@/api/axios';
import type { Seguimiento } from '@/types/seguimiento';

export const seguimientoAbogadoService = {
    async getMyCases(): Promise<Seguimiento[]> {
        const response = await api.get<Seguimiento[]>('/seguimientos/abogado');
        return response.data;
    },

    async addComentario(id: number, etapa: number, comentario: string) {
        const response = await api.post(`/seguimientos/${id}/comentario`, { etapa, comentario });
        return response.data;
    },

    async avanzarEtapa(id: number) {
        const response = await api.patch(`/seguimientos/${id}/avanzar`);
        return response.data;
    },

    async desistir(id: number) {
        const response = await api.patch(`/seguimientos/${id}/desistir`);
        return response.data;
    }
};
