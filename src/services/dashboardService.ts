import api from '@/api/axios';

export interface DashboardStats {
    total_demandas: number;
    total_recuperado: number;
    pagos_pendientes: number;
    abogados_activos: number;
    stages: Array<{
        name: string;
        count: number;
        percent: number;
    }>;
    recent_movements: Array<{
        id: string;
        stage: string;
        amount: string;
        date: string;
    }>;
    top_lawyers: Array<{
        name: string;
        initials: string;
        performance: string;
    }>;
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
};
