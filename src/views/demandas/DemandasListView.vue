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
      <div class="flex items-center gap-3">
        <input 
            type="file" 
            ref="fileInput" 
            accept=".csv" 
            class="hidden" 
            @change="handleFileUpload"
        >
        <button 
          @click="syncAgencias"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-all hover:scale-105 active:scale-95"
          title="Sincronizar agencias desde la App Madre"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Sincronizar Agencias
        </button>
        <button 
          @click="fileInput?.click()"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-all hover:scale-105 active:scale-95"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Importar CSV
        </button>
        <button 
          @click="exportCSV"
          :disabled="exporting"
          class="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          {{ exporting ? 'Exportando...' : 'Exportar CSV' }}
        </button>
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
          <option v-for="estado in availableStates" :key="estado" :value="estado">{{ estado }}</option>
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
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider"
                    :class="getStatusClass(demanda.estado_legal)"
                >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(demanda.estado_legal)"></span>
                    {{ formatStatus(demanda.estado_legal) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openAssignModal(demanda)"
                    class="p-2 rounded-lg transition"
                    :class="demanda.seguimiento ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'"
                    :title="demanda.seguimiento ? 'Reasignar / Actualizar Seguimiento' : 'Asignar Abogado'"
                  >
                    <svg v-if="!demanda.seguimiento" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>

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
      
      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Mostrando <span class="font-bold text-gray-900 dark:text-white">{{ totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> a <span class="font-bold text-gray-900 dark:text-white">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> de <span class="font-bold text-gray-900 dark:text-white">{{ totalItems }}</span> registros
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div class="flex items-center gap-1">
            <template v-for="p in totalPages" :key="p">
              <button 
                v-if="p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)"
                @click="changePage(p)"
                class="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                :class="currentPage === p ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                {{ p }}
              </button>
              <span v-else-if="(p === 2 && currentPage > 3) || (p === totalPages - 1 && currentPage < totalPages - 2)" class="text-gray-400" :key="'sep-' + p">...</span>
            </template>
          </div>

          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages || totalItems === 0"
            class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
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

    <!-- Modal Asignar Abogado -->
    <AsignarAbogadoModal 
        :is-open="isAssignModalOpen"
        :demanda="selectedDemanda"
        :loading="saving"
        @close="closeAssignModal"
        @save="handleAssignAbogado"
    />

    <LiquidacionModal 
        :is-open="isPagosModalOpen"
        :seguimiento-id="selectedSeguimientoId"
        @close="isPagosModalOpen = false"
        @refresh="fetchDemandas"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { demandaService } from '@/services/demandaService'
import { agenciaService } from '@/services/agenciaService'
import type { Demanda } from '@/types/demanda'
import DemandaModal from '@/components/demandas/DemandaModal.vue'
import AsignarAbogadoModal from '../../components/demandas/AsignarAbogadoModal.vue'
import LiquidacionModal from '../../components/pagos/LiquidacionModal.vue'
import { seguimientoService } from '../../services/seguimientoService'
import Swal from 'sweetalert2'

const demandas = ref<Demanda[]>([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const filterEstado = ref('')
const isModalOpen = ref(false)
const isAssignModalOpen = ref(false)
const isPagosModalOpen = ref(false)
const selectedDemanda = ref<Demanda | null>(null)
const selectedSeguimientoId = ref<number | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const exporting = ref(false)

// Paginación
const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Watchers para filtros
watch([searchQuery, filterEstado], () => {
    currentPage.value = 1
    fetchDemandas()
})

const syncAgencias = async () => {
    try {
        Swal.fire({
            title: 'Sincronizando agencias...',
            text: 'Obteniendo datos de la App Madre',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        const response = await agenciaService.syncFromMother()
        
        Swal.fire({
            icon: 'success',
            title: 'Sincronización Exitosa',
            text: response.message
        })
    } catch (error: any) {
        console.error('Error sincronizando agencias:', error)
        Swal.fire('Error', error.response?.data?.detail || 'No se pudo sincronizar las agencias', 'error')
    }
}

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!target.files || target.files.length === 0) return

    const file = target.files[0]
    
    // Validar extensión
    if (!file.name.endsWith('.csv')) {
        Swal.fire('Error', 'Por favor selecciona un archivo .csv', 'error')
        if (fileInput.value) fileInput.value.value = ''
        return
    }

    try {
        Swal.fire({
            title: 'Importando datos...',
            text: 'Por favor no cierres esta ventana',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })

        const response = await demandaService.importCSV(file)
        
        await fetchDemandas()
        
        Swal.fire({
            icon: 'success',
            title: 'Importación Exitosa',
            text: response.message
        })
    } catch (error: any) {
        console.error('Error importing CSV:', error)
        Swal.fire('Error', error.response?.data?.detail || 'Ocurrió un error al importar el archivo', 'error')
    } finally {
        // Reset the input so the same file can be selected again if needed
        if (fileInput.value) fileInput.value.value = ''
    }
}

const exportCSV = async () => {
    exporting.value = true
    try {
        await demandaService.exportCSV()
        Swal.fire({
            icon: 'success',
            title: 'Exportación Exitosa',
            text: 'El archivo CSV se ha descargado correctamente',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        })
    } catch (error) {
        console.error('Error exporting CSV:', error)
        Swal.fire('Error', 'No se pudo exportar el archivo CSV', 'error')
    } finally {
        exporting.value = false
    }
}

const fetchDemandas = async () => {
    loading.value = true
    try {
        const response = await demandaService.getAll({ 
            search: searchQuery.value,
            estado: filterEstado.value,
            page: currentPage.value,
            limit: itemsPerPage.value
        })
        demandas.value = response.data
        totalItems.value = response.total
    } catch (error) {
        console.error('Error fetching demandas:', error)
        Swal.fire('Error', 'No se pudieron cargar las demandas', 'error')
    } finally {
        loading.value = false
    }
}

const changePage = (page: number) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    fetchDemandas()
}

const availableStates = computed(() => {
    const states = new Set<string>()
    // Estados base del sistema
    const baseStates = ['Vigente', 'Desistido', 'Cancelado', 'Suspendido']
    baseStates.forEach(s => states.add(s))
    
    // Como ahora los resultados están paginados, solo podemos sugerir los estados conocidos 
    // o los que aparezcan en la página actual. Para que sea real, el backend debería proveer la lista 
    // de estados únicos si se desea algo dinámico global.
    // Por ahora mantendremos los base + los que aparezcan en la data cargada.
    demandas.value.forEach(d => {
        if (d.estado_legal) {
            const s = d.estado_legal.charAt(0).toUpperCase() + d.estado_legal.slice(1).toLowerCase()
            states.add(s)
        }
    })
    
    return Array.from(states).sort()
})

const filteredDemandas = computed(() => demandas.value)

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

const openAssignModal = (demanda: Demanda) => {
    selectedDemanda.value = demanda
    isAssignModalOpen.value = true
}

const closeAssignModal = () => {
    isAssignModalOpen.value = false
    selectedDemanda.value = null
}

const openPagosModal = (seguimientoId: number) => {
    selectedSeguimientoId.value = seguimientoId
    isPagosModalOpen.value = true
}

const handleAssignAbogado = async (data: any) => {
    saving.value = true
    try {
        await seguimientoService.initialize(data)
        Swal.fire({
            title: '¡Asignado!',
            text: 'El abogado ha sido asignado y el seguimiento se ha iniciado.',
            icon: 'success',
            confirmButtonColor: '#10b981'
        })
        closeAssignModal()
        fetchDemandas()
    } catch (error) {
        console.error('Error assigning abogado:', error)
        Swal.fire('Error', 'No se pudo completar la asignación', 'error')
    } finally {
        saving.value = false
    }
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

const formatStatus = (status: string | null) => {
    if (!status) return 'S/E'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const getStatusClass = (status: string | null) => {
    const s = status?.toUpperCase()
    switch (s) {
        case 'VIGENTE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        case 'DESISTIDO': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        case 'CANCELADO': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        case 'SUSPENDIDO': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
        default: return 'bg-blue-100 text-blue-700'
    }
}

const getStatusDotClass = (status: string | null) => {
    const s = status?.toUpperCase()
    switch (s) {
        case 'VIGENTE': return 'bg-emerald-500'
        case 'DESISTIDO': return 'bg-amber-500'
        case 'CANCELADO': return 'bg-red-500'
        case 'SUSPENDIDO': return 'bg-gray-500'
        default: return 'bg-blue-500'
    }
}

onMounted(fetchDemandas)
</script>
