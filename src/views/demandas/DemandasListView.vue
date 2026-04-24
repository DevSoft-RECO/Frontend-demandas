<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="p-2 bg-indigo-600 rounded-lg text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </span>
          Listado de Demandas
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gestión integral de procesos judiciales y seguimiento.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Registrar Demanda
      </button>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar por crédito, CIF, deudor o juicio..." 
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 transition"
          @keyup.enter="fetchDemandas"
        >
      </div>
      <div class="flex items-center gap-2">
        <select v-model="filterEstado" class="px-4 py-2.5 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 transition">
          <option value="">Todos los estados</option>
          <option value="Vigente">Vigente</option>
          <option value="Desistido">Desistido</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Suspendido">Suspendido</option>
        </select>
        <button @click="fetchDemandas" class="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-900/30">
              <th class="px-6 py-4">Información del Crédito</th>
              <th class="px-6 py-4">Deudor / Juicio</th>
              <th class="px-6 py-4 text-center">Monto Demanda</th>
              <th class="px-6 py-4 text-center">Estado Legal</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                <td v-for="j in 5" :key="j" class="px-6 py-6"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div></td>
            </tr>
            <tr v-else-if="filteredDemandas.length === 0">
                <td colspan="5" class="px-6 py-20 text-center text-gray-400 italic font-medium">No se encontraron registros de demandas.</td>
            </tr>
            <tr 
              v-else
              v-for="demanda in filteredDemandas" 
              :key="demanda.id"
              class="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group"
            >
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{ demanda.no_credito }}</span>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] font-black rounded text-gray-500 dark:text-gray-400">
                      {{ demanda.agencia?.nombre || 'S/A' }}
                    </span>
                    <span class="text-xs text-gray-500">CIF: {{ demanda.cif }}</span>
                  </div>
                  <span class="text-xs text-gray-400" v-if="demanda.codigo_cliente">Cliente: {{ demanda.codigo_cliente }}</span>
                  <span class="text-[10px] font-mono text-indigo-500 dark:text-indigo-400" v-if="demanda.no_credito_t24">T24: {{ demanda.no_credito_t24 }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900 dark:text-white uppercase">{{ demanda.deudor }}</span>
                  <span class="text-xs text-gray-500 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    {{ demanda.no_juicio || 'S/N' }}
                  </span>
                  <span class="text-[10px] text-gray-400 italic" v-if="demanda.abogado_nombre_excel">
                    Abogado: {{ demanda.abogado_nombre_excel }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-black text-gray-900 dark:text-white">
                    {{ formatCurrency(demanda.monto_demanda) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    :class="getStatusClass(demanda.estado_legal)"
                >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(demanda.estado_legal)"></span>
                    {{ demanda.estado_legal }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openEditModal(demanda)"
                    class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    @click="confirmDelete(demanda)"
                    class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <DemandaModal 
        :is-open="isModalOpen" 
        :is-edit="!!selectedDemanda" 
        :initial-data="selectedDemanda"
        :loading="saving"
        @close="closeModal"
        @save="saveDemanda"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { demandaService } from '@/services/demandaService'
import type { Demanda } from '@/types/demanda'
import DemandaModal from '@/components/demandas/DemandaModal.vue'
import Swal from 'sweetalert2'

const demandas = ref<Demanda[]>([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const filterEstado = ref('')
const isModalOpen = ref(false)
const selectedDemanda = ref<Demanda | null>(null)

const fetchDemandas = async () => {
    loading.value = true
    try {
        demandas.value = await demandaService.getAll({ search: searchQuery.value })
    } catch (error) {
        console.error('Error fetching demandas:', error)
        Swal.fire('Error', 'No se pudieron cargar las demandas', 'error')
    } finally {
        loading.value = false
    }
}

const filteredDemandas = computed(() => {
    let result = demandas.value
    if (filterEstado.value) {
        result = result.filter(d => d.estado_legal === filterEstado.value)
    }
    return result
})

const openCreateModal = () => {
    selectedDemanda.value = null
    isModalOpen.value = true
}

const openEditModal = (demanda: Demanda) => {
    selectedDemanda.value = demanda
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    selectedDemanda.value = null
}

const saveDemanda = async (formData: Demanda) => {
    saving.value = true
    try {
        if (selectedDemanda.value?.id) {
            await demandaService.update(selectedDemanda.value.id, formData)
            Swal.fire({ title: 'Actualizado', text: 'Registro actualizado correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 })
        } else {
            await demandaService.create(formData)
            Swal.fire({ title: 'Creado', text: 'Registro creado correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 })
        }
        closeModal()
        fetchDemandas()
    } catch (error) {
        console.error('Error saving demanda:', error)
        Swal.fire('Error', 'No se pudo guardar el registro', 'error')
    } finally {
        saving.value = false
    }
}

const confirmDelete = async (demanda: Demanda) => {
    if (!demanda.id) return
    const result = await Swal.fire({
        title: '¿Eliminar registro?',
        text: `Se eliminará la demanda del deudor ${demanda.deudor}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })
    if (result.isConfirmed) {
        try {
            await demandaService.delete(demanda.id)
            Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success')
            fetchDemandas()
        } catch (error) {
            console.error('Error deleting demanda:', error)
            Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
        }
    }
}

const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'Q0.00'
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(value)
}

const getStatusClass = (status: string | null) => {
    switch (status) {
        case 'Vigente': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        case 'Desistido': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        case 'Cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        case 'Suspendido': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
        default: return 'bg-blue-100 text-blue-700'
    }
}

const getStatusDotClass = (status: string | null) => {
    switch (status) {
        case 'Vigente': return 'bg-emerald-500'
        case 'Desistido': return 'bg-amber-500'
        case 'Cancelado': return 'bg-red-500'
        case 'Suspendido': return 'bg-gray-500'
        default: return 'bg-blue-500'
    }
}

onMounted(fetchDemandas)
</script>
