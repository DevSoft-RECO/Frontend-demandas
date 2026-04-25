<template>
  <div class="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
        Mis Casos <span class="text-emerald-500">Asignados</span>
      </h1>
      <p class="text-slate-500 dark:text-slate-400 font-medium mt-1">Gestión de bitácora procesal y seguimiento legal.</p>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-700 flex items-center gap-4">
        <div :class="`p-3 rounded-2xl ${stat.bgColor}`">
          <component :is="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ stat.label }}</p>
          <p class="text-2xl font-black text-slate-800 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Table / List -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-gray-700">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-gray-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-gray-700">
            <th class="px-6 py-5">No. Crédito / Juicio</th>
            <th class="px-6 py-5">Deudor</th>
            <th class="px-6 py-5">Etapa Actual</th>
            <th class="px-6 py-5">Estado Legal</th>
            <th class="px-6 py-5">Última Actividad</th>
            <th class="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-gray-700">
          <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
            <td colspan="6" class="px-6 py-4"><div class="h-12 bg-slate-100 dark:bg-gray-700 rounded-xl"></div></td>
          </tr>
          
          <tr v-else-if="seguimientos.length === 0">
            <td colspan="6" class="px-6 py-20 text-center text-slate-400">
                <div class="flex flex-col items-center">
                    <svg class="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p class="text-sm font-black uppercase tracking-widest">No tienes casos asignados actualmente</p>
                </div>
            </td>
          </tr>

          <tr 
            v-for="s in seguimientos" 
            :key="s.id" 
            class="hover:bg-slate-50 dark:hover:bg-gray-900/30 transition-colors group"
          >
            <td class="px-6 py-5">
              <p class="text-sm font-black text-slate-800 dark:text-white">{{ s.demanda?.no_credito }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ s.demanda?.no_juicio }}</p>
            </td>
            <td class="px-6 py-5">
              <p class="text-sm font-bold text-slate-600 dark:text-slate-300">{{ s.demanda?.deudor }}</p>
            </td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-2">
                <div 
                    class="w-2 h-2 rounded-full" 
                    :class="s.estado_seguimiento >= 5 ? 'bg-blue-500' : 'bg-emerald-500 animate-pulse'"
                ></div>
                <span class="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  {{ getEtapaName(s.estado_seguimiento) }}
                </span>
              </div>
            </td>
            <td class="px-6 py-5">
              <span 
                class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                :class="statusClass(s.estado_legal_demanda)"
              >
                {{ s.estado_legal_demanda }}
              </span>
            </td>
            <td class="px-6 py-5">
              <p class="text-xs font-medium text-slate-500">{{ formatDate(s.fecha_estado_seguimiento) }}</p>
            </td>
            <td class="px-6 py-5 text-right">
              <button 
                @click="openDetail(s)"
                class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-800/10 hover:shadow-emerald-500/20 active:scale-95"
              >
                Seguimiento
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Detalle -->
    <SeguimientoDetalleModal 
      :is-open="isModalOpen"
      :seguimiento="selectedSeguimiento"
      @close="isModalOpen = false"
      @refresh="fetchCases"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, markRaw } from 'vue'
import { seguimientoAbogadoService } from '@/services/seguimientoAbogadoService'
import SeguimientoDetalleModal from './SeguimientoDetalleModal.vue'
import { 
  ClipboardDocumentCheckIcon, 
  ClockIcon, 
  CheckBadgeIcon, 
  ScaleIcon 
} from '@heroicons/vue/24/outline'

const seguimientos = ref<any[]>([])
const loading = ref(true)
const isModalOpen = ref(false)
const selectedSeguimiento = ref<any>(null)

const stats = computed(() => [
  { 
    label: 'Casos Totales', 
    value: seguimientos.value.length, 
    icon: markRaw(ScaleIcon),
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  { 
    label: 'En Proceso', 
    value: seguimientos.value.filter(s => s.estado_legal_demanda === 'Vigente').length, 
    icon: markRaw(ClockIcon),
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  { 
    label: 'Finalizados', 
    value: seguimientos.value.filter(s => s.estado_legal_demanda === 'Finalizado').length, 
    icon: markRaw(CheckBadgeIcon),
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  { 
    label: 'Requiere Acción', 
    value: seguimientos.value.filter(s => s.estado_legal_demanda === 'Vigente' && s.estado_seguimiento < 5).length, 
    icon: markRaw(ClipboardDocumentCheckIcon),
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400'
  }
])

const fetchCases = async () => {
  loading.value = true
  try {
    const data = await seguimientoAbogadoService.getMyCases()
    seguimientos.value = data

    // Si el modal está abierto, actualizar la referencia del seleccionado
    if (selectedSeguimiento.value) {
      const updated = data.find((s: any) => s.id === selectedSeguimiento.value.id)
      if (updated) selectedSeguimiento.value = updated
    }
  } catch (error) {
    console.error('Error fetching cases:', error)
  } finally {
    loading.value = false
  }
}

const openDetail = (s: any) => {
  selectedSeguimiento.value = s
  isModalOpen.value = true
}

const getEtapaName = (id: number) => {
  const stages = {
    1: 'Presentación',
    2: 'Admisión',
    3: 'Notificación',
    4: 'Ejecución',
    5: 'Finalizado'
  }
  return stages[id as keyof typeof stages] || 'Desconocido'
}

const statusClass = (s: string) => {
  if (s === 'Vigente') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
  if (s === 'Finalizado') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

onMounted(fetchCases)
</script>

<style scoped>
@reference "@/assets/main.css";
</style>
