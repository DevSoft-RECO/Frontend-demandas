<template>
  <div class="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
    <!-- Header Corporativo -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-gray-700 pb-8">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Gestión de <span class="text-emerald-600 font-black">Pagos</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Control de Liquidaciones y Desembolsos Judiciales</p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Export Button -->
        <button 
          @click="exportToCSV"
          :disabled="loading"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all shadow-sm disabled:opacity-50"
        >
          <ArrowDownTrayIcon class="w-4 h-4 text-emerald-600" />
          Exportar CSV
        </button>

        <!-- Search Bar -->
        <div class="hidden md:flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm">
          <MagnifyingGlassIcon class="w-4 h-4 text-slate-400" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar crédito o deudor..." 
            class="bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase text-slate-700 dark:text-white w-48 outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Filtros de Control -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
      <!-- Selector de Bufete -->
      <div class="md:col-span-6 relative">
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Seleccionar Bufete / Abogado</label>
        <div class="relative">
          <button 
            @click="isFilterOpen = !isFilterOpen"
            class="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 hover:border-emerald-500 transition-all shadow-sm group"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-500/10 rounded-xl">
                <UsersIcon class="w-5 h-5 text-emerald-600" />
              </div>
              <div class="text-left">
                <p class="text-xs font-black text-slate-800 dark:text-white uppercase truncate">{{ selectedAbogadoName }}</p>
                <p class="text-[9px] font-bold text-slate-400 uppercase">Filtrar transacciones por este bufete</p>
              </div>
            </div>
            <ChevronDownIcon class="w-5 h-5 text-slate-400 transition-transform" :class="{'rotate-180': isFilterOpen}" />
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
          >
            <div v-if="isFilterOpen" class="absolute top-full left-0 right-0 mt-3 z-[60] bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <div class="p-4 border-b border-slate-50 dark:border-gray-700">
                <div class="relative">
                  <input v-model="searchAbogado" type="text" placeholder="Buscar..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-900/50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500" />
                  <MagnifyingGlassIcon class="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>
              <div class="max-h-64 overflow-y-auto custom-scrollbar">
                <button @click="selectAbogado(null)" class="w-full flex items-center justify-between px-6 py-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  <span class="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Todos los Bufetes</span>
                </button>
                <button 
                  v-for="abogado in filteredBufetes" 
                  :key="abogado.id" 
                  @click="selectAbogado(abogado)" 
                  class="w-full flex items-center justify-between px-6 py-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-t border-slate-50 dark:border-gray-700/50"
                >
                  <span class="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 truncate">{{ abogado.nombre }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Resumen Rápido de Selección -->
      <div class="md:col-span-6 grid grid-cols-2 gap-4">
        <div class="bg-emerald-500 dark:bg-emerald-600 p-5 rounded-3xl text-white shadow-lg shadow-emerald-500/20 flex flex-col justify-between">
          <p class="text-[9px] font-black uppercase tracking-widest opacity-80">Total Pagado</p>
          <h3 class="text-xl font-black mt-1">{{ formatCurrency(totalPagadoFiltrado) }}</h3>
        </div>
        <div class="bg-slate-900 dark:bg-gray-700 p-5 rounded-3xl text-white shadow-lg shadow-slate-900/10 flex flex-col justify-between">
          <p class="text-[9px] font-black uppercase tracking-widest opacity-80">Pendiente Liquidar</p>
          <h3 class="text-xl font-black mt-1 text-amber-400">{{ formatCurrency(totalPendienteFiltrado) }}</h3>
        </div>
      </div>
    </div>

    <!-- Main Table -->
    <div class="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden mb-6">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-gray-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-gray-700">
              <th class="px-8 py-6">Crédito / Deudor</th>
              <th class="px-8 py-6">Bufete Responsable</th>
              <th class="px-8 py-6">Estado Pagos</th>
              <th class="px-8 py-6">Saldo Pendiente</th>
              <th class="px-8 py-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-gray-700">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="5" class="px-8 py-6"><div class="h-10 bg-slate-100 dark:bg-gray-700 rounded-xl"></div></td>
            </tr>
            
            <tr v-else-if="filteredSeguimientos.length === 0">
              <td colspan="5" class="px-8 py-20 text-center text-slate-400">
                  <div class="flex flex-col items-center">
                    <BanknotesIcon class="w-12 h-12 mb-4 opacity-10" />
                    <p class="text-xs font-black uppercase tracking-widest">No hay pagos registrados bajo este filtro</p>
                  </div>
              </td>
            </tr>

            <tr v-for="s in filteredSeguimientos" :key="s.id" class="hover:bg-slate-50/50 dark:hover:bg-gray-900/20 transition-all duration-300">
              <td class="px-8 py-6">
                <p class="text-sm font-black text-slate-800 dark:text-white">{{ s.demanda?.no_credito || s.demanda?.no_credito_t24 || 'N/A' }}</p>
                <p class="text-[10px] font-bold text-slate-500 uppercase mt-0.5 truncate max-w-[200px]">{{ s.demanda?.no_juicio || s.demanda?.deudor || 'No disponible' }}</p>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-slate-400">
                    {{ (s.abogado?.nombre || 'B').charAt(0) }}
                  </div>
                  <p class="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase truncate max-w-[150px]">{{ s.abogado?.nombre || 'Bufete' }}</p>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-1.5">
                  <div 
                    v-for="n in 4" :key="n"
                    class="w-6 h-1.5 rounded-full"
                    :class="isStagePaid(s, n) ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-slate-200 dark:bg-gray-700'"
                  ></div>
                </div>
                <p class="text-[9px] font-black text-slate-400 uppercase mt-2">{{ countPaid(s) }} de 4 Etapas Cubiertas</p>
              </td>
              <td class="px-8 py-6">
                <p class="text-sm font-black text-slate-800 dark:text-white">{{ formatCurrency(calculateSaldo(s)) }}</p>
              </td>
              <td class="px-8 py-6 text-right">
                <button 
                  @click="openLiquidacion(s.id)"
                  class="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
                >
                  Liquidar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación Corporativa -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-6 rounded-3xl mb-10 shadow-sm">
      <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">
        Mostrando <span class="text-slate-900 dark:text-white">{{ (currentPage - 1) * pageSize + 1 }}</span> 
        a <span class="text-slate-900 dark:text-white">{{ Math.min(currentPage * pageSize, totalRecords) }}</span> 
        de <span class="text-slate-900 dark:text-white">{{ totalRecords }}</span> registros
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="currentPage > 1 && (currentPage--)" 
          :disabled="currentPage === 1"
          class="p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <ChevronLeftIcon class="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600" />
        </button>

        <div class="flex items-center gap-1">
          <button 
            v-for="page in visiblePages" :key="page"
            @click="typeof page === 'number' && (currentPage = page)"
            class="min-w-[40px] h-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all"
            :class="currentPage === page ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-50 dark:bg-gray-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700'"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="currentPage < totalPages && (currentPage++)" 
          :disabled="currentPage === totalPages"
          class="p-2.5 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <ChevronRightIcon class="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600" />
        </button>
      </div>
    </div>

    <!-- Modal de Liquidación -->
    <LiquidacionModal 
      :is-open="isModalOpen"
      :seguimiento-id="selectedId"
      @close="isModalOpen = false"
      @refresh="onRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { usePagosStore } from '@/stores/pagos'
import LiquidacionModal from '@/components/pagos/LiquidacionModal.vue'
import api from '@/api/axios'
import { 
  UsersIcon, 
  ChevronDownIcon, 
  MagnifyingGlassIcon, 
  BanknotesIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const pagosStore = usePagosStore()
const searchQuery = ref('')
const loading = ref(true)
const allSeguimientos = ref<any[]>([])
const bufetes = ref<any[]>([])
const isModalOpen = ref(false)
const selectedId = ref<number | null>(null)

// Paginación
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const totalPages = ref(0)

// Filtros
const selectedAbogadoId = ref<number | null>(null)
const isFilterOpen = ref(false)
const searchAbogado = ref('')

const selectedAbogadoName = computed(() => {
  if (selectedAbogadoId.value === null) return 'Todos los Bufetes'
  return bufetes.value.find(b => b.id === selectedAbogadoId.value)?.nombre || 'Bufete Seleccionado'
})

const filteredBufetes = computed(() => {
  if (!searchAbogado.value) return bufetes.value
  return bufetes.value.filter(b => b.nombre.toLowerCase().includes(searchAbogado.value.toLowerCase()))
})

const fetchAllData = async () => {
    loading.value = true
    try {
        await pagosStore.fetchResumen()
        // Cargamos bufetes para el selector
        const bufRes = await api.get('/bufetes')
        bufetes.value = bufRes.data

        // Cargamos seguimientos con paginación
        const response = await api.get('/seguimientos', {
            params: { 
                page: currentPage.value,
                pageSize: pageSize.value,
                abogadoId: selectedAbogadoId.value || 0
            }
        })
        allSeguimientos.value = response.data.data || []
        totalRecords.value = response.data.total || 0
        totalPages.value = response.data.totalPages || 0
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const filteredSeguimientos = computed(() => {
    if (!Array.isArray(allSeguimientos.value)) return []
    return allSeguimientos.value.filter(s => {
        const query = searchQuery.value.toLowerCase()
        return (s.demanda?.no_credito || '').toLowerCase().includes(query) || 
               (s.demanda?.no_credito_t24 || '').toLowerCase().includes(query) ||
               (s.abogado?.nombre || '').toLowerCase().includes(query) ||
               (s.demanda?.deudor || '').toLowerCase().includes(query)
    })
})

const exportToCSV = async () => {
    try {
        const response = await api.get('/seguimientos/export', {
            params: {
                abogadoId: selectedAbogadoId.value || 0
            },
            responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Reporte_Pagos_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Error al exportar CSV:', error)
    }
}

// Lógica de páginas visibles
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage.value > 3) pages.push('...')
    
    let start = Math.max(2, currentPage.value - 1)
    let end = Math.min(totalPages.value - 1, currentPage.value + 1)
    
    if (currentPage.value <= 3) end = 4
    if (currentPage.value >= totalPages.value - 2) start = totalPages.value - 3
    
    for (let i = start; i <= end; i++) pages.push(i)
    
    if (currentPage.value < totalPages.value - 2) pages.push('...')
    pages.push(totalPages.value)
  }
  return pages
})

// Totales filtrados (Nota: estos totales solo reflejan la PÁGINA ACTUAL si los datos vienen paginados del servidor)
// Si necesitas los totales de TODO el bufete, necesitarías un endpoint adicional o recibirlos en la metadata
const totalPagadoFiltrado = computed(() => {
    return filteredSeguimientos.value.reduce((acc, s) => {
        let pagado = 0
        if (s.is_pagado_1) pagado += (s.pago_pactado_1 || 0)
        if (s.is_pagado_2) pagado += (s.pago_pactado_2 || 0)
        if (s.is_pagado_3) pagado += (s.pago_pactado_3 || 0)
        if (s.is_pagado_4) pagado += (s.pago_pactado_4 || 0)
        return acc + pagado
    }, 0)
})

const totalPendienteFiltrado = computed(() => {
    return filteredSeguimientos.value.reduce((acc, s) => acc + calculateSaldo(s), 0)
})

const selectAbogado = (abogado: any | null) => {
  selectedAbogadoId.value = abogado ? abogado.id : null
  currentPage.value = 1 // Reset a primera página al cambiar filtro
  isFilterOpen.value = false
}

const isStagePaid = (s: any, n: number) => s[`is_pagado_${n}`]
const countPaid = (s: any) => {
    let count = 0
    if (s.is_pagado_1) count++
    if (s.is_pagado_2) count++
    if (s.is_pagado_3) count++
    if (s.is_pagado_4) count++
    return count
}

const calculateSaldo = (s: any) => {
    const total = (s.pago_pactado_1 || 0) + (s.pago_pactado_2 || 0) + (s.pago_pactado_3 || 0) + (s.pago_pactado_4 || 0)
    let pagado = 0
    if (s.is_pagado_1) pagado += (s.pago_pactado_1 || 0)
    if (s.is_pagado_2) pagado += (s.pago_pactado_2 || 0)
    if (s.is_pagado_3) pagado += (s.pago_pactado_3 || 0)
    if (s.is_pagado_4) pagado += (s.pago_pactado_4 || 0)
    return total - pagado
}

const openLiquidacion = (id: number) => {
    selectedId.value = id
    isModalOpen.value = true
}

const onRefresh = () => {
    fetchAllData()
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(val)
}

watch([selectedAbogadoId, currentPage], () => {
    fetchAllData()
})

onMounted(fetchAllData)
</script>

<style scoped>
@reference "@/assets/main.css";
.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
