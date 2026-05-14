<template>
  <div class="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
    <!-- Header Corporativo -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-gray-700 pb-8">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-3">
          <div class="w-2 h-8 bg-emerald-600 rounded-full"></div>
          Supervisión <span class="text-emerald-600">Legal Corporativa</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Módulo de Auditoría y Control de Procesos Judiciales</p>
      </div>
      
      <!-- Resultados Rápidos -->
      <div class="flex items-center gap-4 bg-slate-50 dark:bg-gray-800/50 px-6 py-3 rounded-2xl border border-slate-200 dark:border-gray-700">
        <div class="text-right">
          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Registros</p>
          <p class="text-xl font-black text-slate-800 dark:text-white leading-none mt-1">{{ totalItems }}</p>
        </div>
        <div class="w-px h-8 bg-slate-200 dark:border-gray-700"></div>
        <SparklesIcon class="w-5 h-5 text-emerald-500" />
      </div>
    </div>

    <!-- Filters: Corporate Style -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
      <!-- Lawyer Filter -->
      <div class="md:col-span-5 relative">
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Filtrar por Bufete</label>
        <div class="relative">
          <button 
            @click="isFilterOpen = !isFilterOpen; isStatusFilterOpen = false"
            class="w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 hover:border-emerald-500 transition-all shadow-sm focus:ring-2 focus:ring-emerald-500/20"
          >
            <div class="flex items-center gap-3">
              <UsersIcon class="w-4 h-4 text-slate-400" />
              <span class="text-[11px] font-black text-slate-700 dark:text-white uppercase">{{ selectedAbogadoName }}</span>
            </div>
            <ChevronDownIcon class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': isFilterOpen}" />
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
          >
            <div v-if="isFilterOpen" class="absolute top-full left-0 right-0 mt-2 z-[60] bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden">
              <div class="p-3 border-b border-slate-100 dark:border-gray-700">
                <input v-model="searchAbogado" type="text" placeholder="Buscar bufete..." class="w-full px-4 py-2 bg-slate-50 dark:bg-gray-900/50 border-none rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div class="max-h-60 overflow-y-auto custom-scrollbar">
                <button @click="selectAbogado(null)" class="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors">Todos los Bufetes</button>
                <button v-for="abogado in filteredBufetes" :key="abogado.id" @click="selectAbogado(abogado)" class="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 transition-colors border-t border-slate-50 dark:border-gray-700/50">{{ abogado.nombre }}</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Status Filter -->
      <div class="md:col-span-4 relative">
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Estado del Proceso</label>
        <div class="relative">
          <button 
            @click="isStatusFilterOpen = !isStatusFilterOpen; isFilterOpen = false"
            class="w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 hover:border-emerald-500 transition-all shadow-sm focus:ring-2 focus:ring-emerald-500/20"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="statusDotClass(selectedStatus)"></div>
              <span class="text-[11px] font-black text-slate-700 dark:text-white uppercase">{{ selectedStatus }}</span>
            </div>
            <ChevronDownIcon class="w-4 h-4 text-slate-400 transition-transform" :class="{'rotate-180': isStatusFilterOpen}" />
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
          >
            <div v-if="isStatusFilterOpen" class="absolute top-full left-0 right-0 mt-2 z-[60] bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden p-1">
              <button 
                v-for="status in ['Todos', 'Vigente', 'Finalizado', 'Desistido']" 
                :key="status"
                @click="selectedStatus = status; isStatusFilterOpen = false"
                class="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-[10px] font-black uppercase tracking-widest"
                :class="selectedStatus === status ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-600 dark:text-slate-400'"
              >
                <div class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(status)"></div>
                {{ status }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Action Button -->
      <div class="md:col-span-3 flex items-end">
        <button 
          @click="resetFilters"
          class="w-full px-6 py-3.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-slate-900/10 dark:shadow-emerald-500/20"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-gray-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-gray-700">
              <th class="px-6 py-5">No. Crédito / Juicio</th>
              <th class="px-6 py-5">Deudor / Abogado</th>
              <th class="px-6 py-5">Etapa Proceso</th>
              <th class="px-6 py-5">Estado</th>
              <th class="px-6 py-5">Actualización</th>
              <th class="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-gray-700">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="6" class="px-6 py-5"><div class="h-10 bg-slate-100 dark:bg-gray-700 rounded-lg"></div></td>
            </tr>
            
            <tr v-else-if="seguimientos.length === 0">
              <td colspan="6" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center">
                    <div class="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-full mb-4">
                      <ScaleIcon class="w-8 h-8 text-slate-300" />
                    </div>
                    <p class="text-xs font-black uppercase tracking-widest text-slate-400">Sin registros encontrados</p>
                  </div>
              </td>
            </tr>

            <tr v-for="s in seguimientos" :key="s.id" class="hover:bg-slate-50/50 dark:hover:bg-gray-900/20 transition-colors">
              <td class="px-6 py-5">
                <p class="text-xs font-black text-slate-800 dark:text-white">{{ s.demanda?.no_credito || s.demanda?.no_credito_t24 || 'N/A' }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{{ s.demanda?.no_juicio || 'S/N Juicio' }}</p>
              </td>
              <td class="px-6 py-5">
                <p class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ s.demanda?.deudor || 'No disponible' }}</p>
                <p class="text-[9px] font-black text-emerald-600 uppercase mt-1">{{ s.abogado?.nombre || 'Pendiente' }}</p>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full" :class="s.estado_seguimiento >= 5 ? 'bg-blue-500' : 'bg-emerald-500'"></div>
                  <span class="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">
                    {{ getEtapaName(s.estado_seguimiento) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border" :class="statusClass(s.estado_legal_demanda)">
                  {{ s.estado_legal_demanda }}
                </span>
              </td>
              <td class="px-6 py-5 text-[10px] font-bold text-slate-500">{{ formatDate(s.fecha_estado_seguimiento) }}</td>
              <td class="px-6 py-5 text-right">
                <button @click="openDetail(s)" class="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <ChevronRightIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Corporativa -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
      <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Mostrando {{ seguimientos.length }} de {{ totalItems }} registros
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-30 transition-all hover:border-emerald-500 group"
        >
          <ChevronLeftIcon class="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600" />
        </button>
        
        <div class="flex items-center gap-1">
          <button 
            v-for="p in totalPages" 
            :key="p"
            @click="changePage(p)"
            class="w-8 h-8 rounded-lg text-[10px] font-black transition-all"
            :class="currentPage === p ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-500 hover:border-emerald-500'"
          >
            {{ p }}
          </button>
        </div>

        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-30 transition-all hover:border-emerald-500 group"
        >
          <ChevronRightIcon class="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600" />
        </button>
      </div>
    </div>

    <!-- Modal Detail -->
    <SeguimientoDetalleModal 
      :is-open="isModalOpen"
      :seguimiento="selectedSeguimiento"
      :readonly="true"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/api/axios'
import SeguimientoDetalleModal from '../abogado/SeguimientoDetalleModal.vue'
import { 
  UsersIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  SparklesIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  ScaleIcon,
  ClockIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'

// Data
const seguimientos = ref<any[]>([])
const bufetes = ref<any[]>([])
const loading = ref(true)
const selectedSeguimiento = ref<any>(null)
const isModalOpen = ref(false)

// Pagination & Filtering
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = ref(1)

const selectedAbogadoId = ref<number | null>(null)
const selectedStatus = ref('Todos')
const searchAbogado = ref('')
const isFilterOpen = ref(false)
const isStatusFilterOpen = ref(false)

const selectedAbogadoName = computed(() => {
  if (selectedAbogadoId.value === null) return 'Todos los Bufetes'
  return bufetes.value.find(b => b.id === selectedAbogadoId.value)?.nombre || 'Bufete'
})

const filteredBufetes = computed(() => {
  if (!searchAbogado.value) return bufetes.value
  return bufetes.value.filter(b => b.nombre.toLowerCase().includes(searchAbogado.value.toLowerCase()))
})

const fetchData = async () => {
  loading.value = true
  try {
    const [segRes, bufRes] = await Promise.all([
      api.get('/seguimientos', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          abogadoId: selectedAbogadoId.value,
          status: selectedStatus.value
        }
      }),
      api.get('/bufetes')
    ])
    
    // El backend ahora devuelve un objeto con metadata
    seguimientos.value = segRes.data.data
    totalItems.value = segRes.data.total
    totalPages.value = segRes.data.totalPages
    
    bufetes.value = bufRes.data
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const selectAbogado = (abogado: any | null) => {
  selectedAbogadoId.value = abogado ? abogado.id : null
  isFilterOpen.value = false
  currentPage.value = 1
}

const resetFilters = () => {
  selectedAbogadoId.value = null
  selectedStatus.value = 'Todos'
  currentPage.value = 1
}

const changePage = (p: number) => {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
}

const statusDotClass = (status: string) => {
  if (status === 'Todos') return 'bg-slate-400'
  if (status === 'Vigente') return 'bg-emerald-500'
  if (status === 'Finalizado') return 'bg-blue-500'
  if (status === 'Desistido') return 'bg-red-500'
  return 'bg-gray-400'
}

const statusClass = (s: string) => {
  if (s === 'Vigente') return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
  if (s === 'Finalizado') return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
  return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
}

const getEtapaName = (id: number) => {
  const stages = { 1: 'Presentación', 2: 'Admisión', 3: 'Notificación', 4: 'Ejecución', 5: 'Finalizado' }
  return stages[id as keyof typeof stages] || 'Desconocido'
}

const formatDate = (date: string) => {
  if (!date) return 'S/N'
  return new Date(date).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' })
}

const openDetail = (s: any) => {
  selectedSeguimiento.value = s
  isModalOpen.value = true
}

// Watchers
watch([selectedAbogadoId, selectedStatus], () => {
  currentPage.value = 1
  fetchData()
})

watch(currentPage, fetchData)

onMounted(fetchData)
</script>

<style scoped>
@reference "@/assets/main.css";
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
