import { defineStore } from 'pinia';
import { pagosService, type ResumenAbogado } from '@/services/pagosService';

export const usePagosStore = defineStore('pagos', {
    state: () => ({
        resumenAbogados: [] as ResumenAbogado[],
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchResumen() {
            this.loading = true;
            try {
                this.resumenAbogados = await pagosService.getResumenAbogados();
            } catch (err: any) {
                this.error = 'Error al cargar el resumen de pagos';
                console.error(err);
            } finally {
                this.loading = false;
            }
        }
    }
});
