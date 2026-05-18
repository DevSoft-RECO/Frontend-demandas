<template>
  <div class="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Panel de <span class="text-emerald-500">Abogados</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium mt-1">Gestión de bitácora procesal y seguimiento legal.</p>
      </div>

      <!-- Tab Switcher Corporativo -->
      <div class="bg-slate-100 dark:bg-gray-800 p-1.5 rounded-2xl flex items-center gap-1 self-start shadow-inner">
        <button 
          v-for="tab in tabs" :key="tab.id"
          @click="currentTabId = tab.id"
          class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
          :class="[
            currentTabId === tab.id 
            ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-black/5' 
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ml-1 px-1.5 py-0.5 bg-slate-200 dark:bg-gray-600 rounded-md text-[8px]">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-700 flex items-center gap-4 transition-all hover:shadow-md">
        <div :class="`p-3 rounded-2xl ${stat.bgColor}`">
          <component :is="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ stat.label }}</p>
          <p class="text-2xl font-black text-slate-800 dark:text-white">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Table -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-gray-700">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-gray-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-gray-700">
            <th class="px-8 py-6">No. Crédito / Juicio</th>
            <th class="px-8 py-6">Deudor</th>
            <th class="px-8 py-6">Etapa Actual</th>
            <th class="px-8 py-6">Estado Legal</th>
            <th class="px-8 py-6">Última Actividad</th>
            <th class="px-8 py-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-gray-700">
          <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
            <td colspan="6" class="px-8 py-6"><div class="h-12 bg-slate-100 dark:bg-gray-700 rounded-xl"></div></td>
          </tr>
          
          <tr v-else-if="paginatedSeguimientos.length === 0">
            <td colspan="6" class="px-8 py-24 text-center text-slate-400">
                <div class="flex flex-col items-center">
                    <component :is="currentTabIcon" class="w-16 h-16 mb-4 opacity-10" />
                    <p class="text-xs font-black uppercase tracking-widest">No hay registros en la categoría "{{ currentTabLabel }}"</p>
                </div>
            </td>
          </tr>

          <tr 
            v-for="s in paginatedSeguimientos" 
            :key="s.id" 
            class="hover:bg-slate-50/50 dark:hover:bg-gray-900/30 transition-all group"
          >
            <td class="px-8 py-6">
              <p class="text-sm font-black text-slate-800 dark:text-white">{{ s.demanda?.no_credito || s.demanda?.no_credito_t24 || 'N/A' }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ s.demanda?.no_juicio || 'No disponible' }}</p>
            </td>
            <td class="px-8 py-6">
              <p class="text-sm font-bold text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{{ s.demanda?.deudor }}</p>
            </td>
            <td class="px-8 py-6">
              <div class="flex items-center gap-2">
                <div 
                    class="w-2 h-2 rounded-full" 
                    :class="s.estado_seguimiento >= 5 || s.estado_legal_demanda === 'Desistido' ? 'bg-blue-500 shadow-sm shadow-blue-500/30' : 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/30'"
                ></div>
                <span class="text-xs font-black uppercase tracking-widest" :class="s.estado_legal_demanda === 'Desistido' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'">
                  {{ s.estado_legal_demanda === 'Desistido' ? 'Finalización Anticipada' : getEtapaName(s.estado_seguimiento) }}
                </span>
              </div>
            </td>
            <td class="px-8 py-6">
              <span 
                class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                :class="statusClass(s.estado_legal_demanda)"
              >
                {{ s.estado_legal_demanda }}
              </span>
            </td>
            <td class="px-8 py-6">
              <p class="text-xs font-medium text-slate-500">{{ formatDate(s.fecha_estado_seguimiento) }}</p>
            </td>
            <td class="px-8 py-6 text-right">
              <button 
                @click="openDetail(s)"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 group"
              >
                Gestionar
                <ChevronRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
  ClockIcon, 
  CheckBadgeIcon, 
  ScaleIcon,
  ChevronRightIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'

const seguimientos = ref<any[]>([])
const loading = ref(true)
const isModalOpen = ref(false)
const selectedSeguimiento = ref<any>(null)
const currentTabId = ref('proceso')
const tabs = computed(() => [
  { 
    id: 'proceso', 
    label: 'En Proceso', 
    icon: markRaw(ClockIcon),
    count: seguimientos.value.filter(s => s.estado_legal_demanda === 'Vigente').length
  },
  { 
    id: 'finalizado', 
    label: 'Finalizados', 
    icon: markRaw(CheckBadgeIcon),
    count: seguimientos.value.filter(s => ['Finalizado', 'Desistido'].includes(s.estado_legal_demanda)).length
  },
  { 
    id: 'todos', 
    label: 'Todos', 
    icon: markRaw(Squares2X2Icon),
    count: seguimientos.value.length
  }
])

const currentTabLabel = computed(() => tabs.value.find(t => t.id === currentTabId.value)?.label)
const currentTabIcon = computed(() => tabs.value.find(t => t.id === currentTabId.value)?.icon)

const paginatedSeguimientos = computed(() => {
  if (currentTabId.value === 'proceso') {
    return seguimientos.value.filter(s => s.estado_legal_demanda === 'Vigente')
  }
  if (currentTabId.value === 'finalizado') {
    return seguimientos.value.filter(s => ['Finalizado', 'Desistido'].includes(s.estado_legal_demanda))
  }
  return seguimientos.value
})

const stats = computed(() => [
  { 
    label: 'Casos Totales', 
    value: seguimientos.value.length, 
    icon: markRaw(ScaleIcon),
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  { 
    label: 'Vigentes', 
    value: seguimientos.value.filter(s => s.estado_legal_demanda === 'Vigente').length, 
    icon: markRaw(ClockIcon),
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  { 
    label: 'Cerrados', 
    value: seguimientos.value.filter(s => ['Finalizado', 'Desistido'].includes(s.estado_legal_demanda)).length, 
    icon: markRaw(CheckBadgeIcon),
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
])

const fetchCases = async () => {
  loading.value = true
  try {
    const data = await seguimientoAbogadoService.getMyCases()
    seguimientos.value = data

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
  if (s === 'Desistido') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
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
