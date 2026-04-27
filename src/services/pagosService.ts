import api from '@/api/axios';

export interface ResumenAbogado {
    id: number;
    nombre: string;
    total_casos: number;
    total_pagado: number;
    total_pendiente: number;
}

export interface DetallePago {
    seguimiento: any;
    total_comision: number;
    total_pagado: number;
    saldo_restante: number;
}

export const pagosService = {
    async getResumenAbogados(): Promise<ResumenAbogado[]> {
        const response = await api.get<ResumenAbogado[]>('/pagos/resumen-abogados');
        return response.data;
    },

    async getDetalleSeguimiento(id: number): Promise<DetallePago> {
        const response = await api.get<DetallePago>(`/pagos/seguimiento/${id}`);
        return response.data;
    },

    async registrarDesembolso(id_seguimiento: number, etapa: number | string, cancelar: boolean = false) {
        const response = await api.patch('/pagos/registrar-desembolso', { id_seguimiento, etapa, cancelar });
        return response.data;
    }
};
