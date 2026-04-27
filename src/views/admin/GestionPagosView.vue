<template>
  <div class="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Gestión de <span class="text-emerald-500">Pagos</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 font-medium mt-1">Control de liquidaciones y desembolsos a bufetes.</p>
      </div>
      <div class="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700">
        <svg class="w-5 h-5 text-slate-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar crédito o abogado..." 
          class="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 dark:text-white w-64"
        />
      </div>
    </div>

    <!-- Abogados Summary Horizontal Scroll -->
    <div class="flex gap-4 overflow-x-auto pb-4 mb-8 custom-scrollbar">
      <div 
        v-for="abogado in pagosStore.resumenAbogados" 
        :key="abogado.id"
        class="min-w-[280px] bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-700 hover:border-emerald-500 transition-all cursor-pointer group"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ abogado.total_casos }} Casos</span>
        </div>
        <h4 class="text-sm font-black text-slate-800 dark:text-white truncate mb-4">{{ abogado.nombre }}</h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-[9px] font-bold text-slate-400 uppercase">Pagado</span>
            <span class="text-xs font-black text-emerald-600">{{ formatCurrency(abogado.total_pagado) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[9px] font-bold text-slate-400 uppercase">Pendiente</span>
            <span class="text-xs font-black text-amber-600">{{ formatCurrency(abogado.total_pendiente) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table (Combined View of Seguimientos) -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-gray-700">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-gray-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 dark:border-gray-700">
            <th class="px-6 py-5">Crédito / Abogado</th>
            <th class="px-6 py-5">Progreso Legal</th>
            <th class="px-6 py-5">Progreso Financiero</th>
            <th class="px-6 py-5">Saldo</th>
            <th class="px-6 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-gray-700">
          <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
            <td colspan="5" class="px-6 py-6"><div class="h-10 bg-slate-100 dark:bg-gray-700 rounded-xl"></div></td>
          </tr>
          
          <tr v-else v-for="s in filteredSeguimientos" :key="s.id" class="hover:bg-slate-50 dark:hover:bg-gray-900/30 transition-colors">
            <td class="px-6 py-5">
              <p class="text-sm font-black text-slate-800 dark:text-white">{{ s.demanda?.no_credito }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase">{{ s.bufete_nombre || 'Abogado Asignado' }}</p>
            </td>
            <td class="px-6 py-5">
              <div class="flex gap-1">
                <div 
                  v-for="n in 4" :key="n"
                  class="w-8 h-1.5 rounded-full"
                  :class="s.estado_seguimiento >= n ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-gray-700'"
                ></div>
              </div>
              <p class="text-[9px] font-bold text-slate-400 uppercase mt-2">Etapa {{ s.estado_seguimiento }} / 4</p>
            </td>
            <td class="px-6 py-5">
              <div class="flex gap-1">
                <div 
                  v-for="n in 4" :key="n"
                  class="w-8 h-1.5 rounded-full"
                  :class="isStagePaid(s, n) ? 'bg-blue-500' : 'bg-slate-200 dark:bg-gray-700'"
                ></div>
              </div>
              <p class="text-[9px] font-bold text-slate-400 uppercase mt-2">{{ countPaid(s) }} Pagadas</p>
            </td>
            <td class="px-6 py-5">
              <p class="text-sm font-black text-slate-800 dark:text-white">{{ formatCurrency(calculateSaldo(s)) }}</p>
            </td>
            <td class="px-6 py-5 text-right">
              <button 
                @click="openLiquidacion(s.id)"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Liquidar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <LiquidacionModal 
      :is-open="isModalOpen"
      :seguimiento-id="selectedId"
      @close="isModalOpen = false"
      @refresh="onRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePagosStore } from '@/stores/pagos'
import LiquidacionModal from '@/components/pagos/LiquidacionModal.vue'
import api from '@/api/axios'

const pagosStore = usePagosStore()
const searchQuery = ref('')
const loading = ref(true)
const allSeguimientos = ref<any[]>([])
const isModalOpen = ref(false)
const selectedId = ref<number | null>(null)

const fetchAllData = async () => {
    loading.value = true
    try {
        await pagosStore.fetchResumen()
        const response = await api.get('/seguimientos') // Reutilizamos el de listado general
        allSeguimientos.value = response.data
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const filteredSeguimientos = computed(() => {
    return allSeguimientos.value.filter(s => {
        const query = searchQuery.value.toLowerCase()
        return s.demanda?.no_credito?.toLowerCase().includes(query) || 
               s.bufete_nombre?.toLowerCase().includes(query) ||
               s.demanda?.deudor?.toLowerCase().includes(query)
    })
})

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

onMounted(fetchAllData)
</script>

<style scoped>
@reference "@/assets/main.css";
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
