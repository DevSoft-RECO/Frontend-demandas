<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    
    <!-- Welcome Header -->
    <div class="relative overflow-hidden bg-gradient-to-r from-azul-cope to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h2 class="text-3xl font-black tracking-tight mb-2">¡Bienvenido de nuevo, {{ userName }}!</h2>
                <p class="text-white/70 text-sm font-medium max-w-md italic">
                    Aquí tienes el resumen ejecutivo de la gestión de demandas y seguimiento legal al día de hoy.
                </p>
            </div>
            <div class="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                <div class="text-right">
                    <p class="text-[10px] font-black uppercase tracking-widest text-verde-cope">Estado del Sistema</p>
                    <p class="text-sm font-bold">Operativo 100%</p>
                </div>
                <div class="w-10 h-10 bg-verde-cope rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(90,186,3,0.5)]">
                    <svg class="w-6 h-6 text-azul-cope" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>
        <!-- Decorative Shapes -->
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-verde-cope/10 rounded-full blur-3xl"></div>
        <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="kpi in kpis" :key="kpi.label" 
             class="group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex justify-between items-start mb-4">
                <div :class="`p-3 rounded-2xl ${kpi.bgColor} ${kpi.iconColor} transition-colors duration-300`">
                    <svg v-html="kpi.icon" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"></svg>
                </div>
                <span :class="`text-[10px] font-black px-2 py-1 rounded-lg ${kpi.trendColor} bg-opacity-10`" v-if="kpi.trend">
                    {{ kpi.trend }}
                </span>
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ kpi.label }}</p>
            <h3 class="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{{ kpi.value }}</h3>
        </div>
    </div>

    <!-- Middle Section: Analytics & Progress -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Progress by Stage -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Embudo de Etapas Legales</h3>
                    <p class="text-xs text-slate-400 font-bold mt-1 uppercase">Distribución actual de expedientes</p>
                </div>
                <button class="p-2 text-slate-400 hover:text-verde-cope transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>
            </div>
            
            <div class="space-y-6">
                <div v-for="stage in stages" :key="stage.name" class="group">
                    <div class="flex justify-between mb-2">
                        <span class="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wide">{{ stage.name }}</span>
                        <span class="text-[11px] font-black text-verde-cope">{{ stage.count }} Casos</span>
                    </div>
                    <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            class="h-full bg-verde-cope transition-all duration-1000 ease-out relative"
                            :style="{ width: `${stage.percent}%` }"
                        >
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bufetes Destacados -->
        <div class="bg-azul-cope rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <h3 class="text-lg font-black uppercase tracking-tight mb-6">Eficiencia Legal</h3>
            <div class="space-y-6">
                <div v-for="bufete in bufetes" :key="bufete.name" class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-verde-cope">
                        {{ bufete.initials }}
                    </div>
                    <div class="flex-1">
                        <p class="text-[11px] font-bold truncate uppercase">{{ bufete.name }}</p>
                        <p class="text-[9px] text-white/50 font-black tracking-widest uppercase mt-0.5">{{ bufete.performance }} de Éxito</p>
                    </div>
                </div>
            </div>
            <!-- Decorative circle -->
            <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-verde-cope opacity-10 rounded-full blur-2xl"></div>
        </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl">
        <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Últimos Movimientos Financieros</h3>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-slate-50 dark:bg-slate-800/50">
                    <tr class="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th class="px-6 py-4 rounded-l-2xl">Expediente</th>
                        <th class="px-6 py-4">Etapa</th>
                        <th class="px-6 py-4">Monto</th>
                        <th class="px-6 py-4">Fecha</th>
                        <th class="px-6 py-4 rounded-r-2xl text-right">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                    <tr v-for="move in movements" :key="move.id" class="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                        <td class="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300">{{ move.id }}</td>
                        <td class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ move.stage }}</td>
                        <td class="px-6 py-4 text-xs font-black text-slate-800 dark:text-white">{{ move.amount }}</td>
                        <td class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{{ move.date }}</td>
                        <td class="px-6 py-4 text-right">
                            <span class="px-3 py-1 bg-verde-cope/10 text-verde-cope rounded-lg text-[9px] font-black uppercase tracking-widest">Registrado</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'

const authStore = useAuthStore()
const userName = computed(() => authStore.user?.name || 'Administrador')

const kpis = ref([
    { 
        label: 'Demandas Totales', 
        value: '0', 
        trend: '', 
        bgColor: 'bg-blue-50 dark:bg-blue-900/10', 
        iconColor: 'text-blue-600',
        trendColor: 'text-blue-600',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1v5m-4 0h4" />' 
    },
    { 
        label: 'Recuperación Total', 
        value: 'Q 0.00', 
        trend: '', 
        bgColor: 'bg-verde-cope/10', 
        iconColor: 'text-verde-cope',
        trendColor: 'text-verde-cope',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' 
    },
    { 
        label: 'Pagos por Registrar', 
        value: '0', 
        trend: '', 
        bgColor: 'bg-amber-50 dark:bg-amber-900/10', 
        iconColor: 'text-amber-600',
        trendColor: 'text-red-600',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />' 
    },
    { 
        label: 'Abogados Activos', 
        value: '0', 
        trend: 'En red', 
        bgColor: 'bg-purple-50 dark:bg-purple-900/10', 
        iconColor: 'text-purple-600',
        trendColor: 'text-slate-500',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />' 
    },
])

const stages = ref<DashboardStats['stages']>([])
const movements = ref<DashboardStats['recent_movements']>([])
const bufetes = ref<DashboardStats['top_lawyers']>([])
const loading = ref(true)

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(val)
}

const fetchStats = async () => {
    try {
        const data = await dashboardService.getStats()
        
        // Map KPIs
        kpis.value[0].value = data.total_demandas.toString()
        kpis.value[1].value = formatCurrency(data.total_recuperado)
        kpis.value[2].value = data.pagos_pendientes.toString()
        kpis.value[3].value = data.abogados_activos.toString()

        stages.value = data.stages
        movements.value = data.recent_movements
        bufetes.value = data.top_lawyers
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
    } finally {
        loading.value = false
    }
}

onMounted(fetchStats)
</script>

<style scoped>
@reference "@/assets/main.css";
</style>
