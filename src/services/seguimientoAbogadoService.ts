import api from '@/api/axios';
import type { Seguimiento } from '@/types/seguimiento';

export const seguimientoAbogadoService = {
    async getMyCases(): Promise<Seguimiento[]> {
        const response = await api.get<Seguimiento[]>('/seguimientos/abogado');
        return response.data;
    },

    async addComentario(id: number, etapa: number, comentario: string, archivo?: File | null) {
        const formData = new FormData();
        formData.append('etapa', etapa.toString());
        formData.append('comentario', comentario);
        if (archivo) {
            formData.append('archivo', archivo);
        }

        const response = await api.post(`/seguimientos/${id}/comentario`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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
