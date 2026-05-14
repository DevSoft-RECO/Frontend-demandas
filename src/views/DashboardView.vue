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

    <!-- Status Distribution Bar -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Estado de los procesos</h3>
                <p class="text-xs text-slate-400 font-bold mt-1 uppercase">Distribución de expedientes según su estado legal</p>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/20 text-center">
                <p class="text-3xl font-black text-emerald-600">{{ statusCounts.vigentes }}</p>
                <p class="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">Vigentes</p>
            </div>
            <div class="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-800/20 text-center">
                <p class="text-3xl font-black text-red-600">{{ statusCounts.desistidos }}</p>
                <p class="text-[10px] font-black uppercase tracking-widest text-red-500 mt-1">Desistidos</p>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/20 text-center">
                <p class="text-3xl font-black text-blue-600">{{ statusCounts.finalizados }}</p>
                <p class="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1">Finalizados</p>
            </div>
        </div>
    </div>

    <!-- Middle Section: Analytics & Progress -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Progress by Stage -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Embudo de Etapas Legales</h3>
                    <p class="text-xs text-slate-400 font-bold mt-1 uppercase">Distribución actual de expedientes asignados</p>
                </div>
            </div>
            
            <div class="space-y-6">
                <div v-for="stage in stages" :key="stage.name" class="group">
                    <div class="flex justify-between mb-2">
                        <span class="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wide">{{ stage.name }}</span>
                        <span class="text-[11px] font-black text-verde-cope">{{ stage.count }} Casos ({{ stage.percent }}%)</span>
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
            <div v-if="bufetes.length === 0" class="flex flex-col items-center justify-center h-40 text-white/40">
                <svg class="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p class="text-[10px] font-bold uppercase">Sin bufetes asignados</p>
            </div>
            <div class="space-y-5" v-else>
                <div v-for="bufete in bufetes" :key="bufete.name" class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-verde-cope flex-shrink-0">
                        {{ bufete.initials }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-[11px] font-bold truncate uppercase">{{ bufete.name }}</p>
                        <div class="flex items-center gap-3 mt-0.5">
                            <span class="text-[9px] text-white/50 font-black tracking-widest uppercase">{{ bufete.performance }} Avance</span>
                            <span class="text-[9px] text-verde-cope/80 font-black">{{ bufete.casos_asignados }} casos</span>
                        </div>
                        <p v-if="bufete.total_desembolso > 0" class="text-[9px] text-white/40 font-bold mt-0.5">
                            Desembolsado: {{ formatCurrency(bufete.total_desembolso) }}
                        </p>
                    </div>
                </div>
            </div>
            <!-- Decorative circle -->
            <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-verde-cope opacity-10 rounded-full blur-2xl"></div>
        </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl">
        <h3 class="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6">Últimos Desembolsos Registrados</h3>
        
        <div v-if="movements.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
            <svg class="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p class="text-xs font-bold uppercase tracking-widest">No se han registrado desembolsos aún</p>
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-slate-50 dark:bg-slate-800/50">
                    <tr class="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th class="px-6 py-4 rounded-l-2xl">Expediente</th>
                        <th class="px-6 py-4">Deudor</th>
                        <th class="px-6 py-4">Concepto</th>
                        <th class="px-6 py-4">Monto</th>
                        <th class="px-6 py-4 rounded-r-2xl">Fecha Pago</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-white/5">
                    <tr v-for="move in movements" :key="move.id + move.date" class="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                        <td class="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300">{{ move.id }}</td>
                        <td class="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{{ move.deudor }}</td>
                        <td class="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ move.stage }}</td>
                        <td class="px-6 py-4 text-xs font-black text-slate-800 dark:text-white">{{ move.amount }}</td>
                        <td class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{{ move.date }}</td>
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
        label: 'Total Desembolsado Pagado', 
        value: 'Q 0', 
        trend: '', 
        bgColor: 'bg-verde-cope/10', 
        iconColor: 'text-verde-cope',
        trendColor: 'text-verde-cope',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' 
    },
    { 
        label: 'Saldo pendiente por pagar', 
        value: 'Q 0', 
        trend: '', 
        bgColor: 'bg-amber-50 dark:bg-amber-900/10', 
        iconColor: 'text-amber-600',
        trendColor: 'text-amber-600',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />' 
    },
    { 
        label: 'Capital en Riesgo Vigente', 
        value: 'Q 0', 
        trend: '', 
        bgColor: 'bg-purple-50 dark:bg-purple-900/10', 
        iconColor: 'text-purple-600',
        trendColor: 'text-slate-500',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />' 
    },
])

const stages = ref<DashboardStats['stages']>([])
const movements = ref<DashboardStats['recent_movements']>([])
const bufetes = ref<DashboardStats['top_lawyers']>([])
const statusCounts = ref({ vigentes: 0, desistidos: 0, finalizados: 0 })
const loading = ref(true)

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val)
}

const fetchStats = async () => {
    try {
        const data = await dashboardService.getStats()
        
        // Map KPIs
        kpis.value[0].value = data.total_demandas.toLocaleString()
        kpis.value[1].value = formatCurrency(data.total_recuperado)
        kpis.value[2].value = formatCurrency(data.total_pendiente)
        kpis.value[3].value = formatCurrency(data.capital_en_riesgo)

        // Status distribution
        statusCounts.value = {
            vigentes: data.casos_vigentes,
            desistidos: data.casos_desistidos,
            finalizados: data.casos_finalizados
        }

        // Badge indicators
        kpis.value[0].trend = `${data.abogados_activos} Bufetes`
        kpis.value[2].trend = `${data.pagos_pendientes} pagos`

        stages.value = data.stages || []
        movements.value = data.recent_movements || []
        bufetes.value = data.top_lawyers || []
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
