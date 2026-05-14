import api from '@/api/axios';

export interface DashboardStats {
    total_demandas: number;
    total_recuperado: number;
    total_pendiente: number;
    pagos_pendientes: number;
    abogados_activos: number;
    casos_vigentes: number;
    casos_desistidos: number;
    casos_finalizados: number;
    capital_en_riesgo: number;
    stages: Array<{
        name: string;
        count: number;
        percent: number;
    }>;
    recent_movements: Array<{
        id: string;
        deudor: string;
        stage: string;
        amount: string;
        date: string;
    }>;
    top_lawyers: Array<{
        name: string;
        initials: string;
        performance: string;
        casos_asignados: number;
        casos_avanzados: number;
        total_desembolso: number;
    }>;
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
};
