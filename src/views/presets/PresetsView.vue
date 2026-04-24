<template>
  <div class="p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="p-2 bg-blue-600 rounded-lg text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          Configuración de Presets
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Administra los rangos, porcentajes y etapas de las demandas.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Preset
      </button>
    </div>

    <!-- Stats/Quick Info (Optional Premium Touch) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase">Total Presets</p>
          <p class="text-2xl font-black text-gray-900 dark:text-white">{{ presets.length }}</p>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
        <div class="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase">Activos</p>
          <p class="text-2xl font-black text-gray-900 dark:text-white">{{ presets.filter(p => p.activo).length }}</p>
        </div>
      </div>
       <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
        <div class="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase">Más Utilizado</p>
          <p class="text-2xl font-black text-gray-900 dark:text-white">-</p>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="relative w-full md:w-96">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar preset por nombre..." 
            class="w-full pl-10 pr-4 py-2 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 transition"
          >
        </div>
        <div class="flex items-center gap-2">
            <button @click="fetchPresets" class="p-2 text-gray-500 hover:text-blue-600 transition" title="Refrescar">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-900/30">
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre / Descripción</th>
              <th class="px-6 py-4 text-center">Rango (Q)</th>
              <th class="px-6 py-4 text-center">% Comisión</th>
              <th class="px-6 py-4 text-center">Estado</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
                <td v-for="j in 6" :key="j" class="px-6 py-6"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div></td>
            </tr>
            <tr v-else-if="filteredPresets.length === 0">
                <td colspan="6" class="px-6 py-20 text-center text-gray-400 italic">No se encontraron presets.</td>
            </tr>
            <tr 
              v-else
              v-for="preset in filteredPresets" 
              :key="preset.id"
              class="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
            >
              <td class="px-6 py-4 text-sm font-bold text-gray-400">#{{ preset.id }}</td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{ preset.nombre }}</span>
                  <span class="text-xs text-gray-400 truncate max-w-[200px]">{{ preset.descripcion || 'Sin descripción' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="inline-flex flex-col items-center">
                  <span class="text-xs font-black text-blue-600 dark:text-blue-400">
                    {{ formatCurrency(preset.rango_min) }} - {{ formatCurrency(preset.rango_max) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {{ preset.porcentaje_comision }}%
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    :class="preset.activo ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'"
                >
                    <span class="w-1.5 h-1.5 rounded-full" :class="preset.activo ? 'bg-green-500' : 'bg-red-500'"></span>
                    {{ preset.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="openEditModal(preset)"
                    class="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    @click="confirmDelete(preset)"
                    class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
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
    <PresetModal 
        :is-open="isModalOpen" 
        :is-edit="!!selectedPreset" 
        :initial-data="selectedPreset"
        :loading="saving"
        @close="closeModal"
        @save="savePreset"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { presetService } from '@/services/presetService'
import type { Preset } from '@/types/preset'
import PresetModal from '@/components/presets/PresetModal.vue'
import Swal from 'sweetalert2'

const presets = ref<Preset[]>([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const isModalOpen = ref(false)
const selectedPreset = ref<Preset | null>(null)

const fetchPresets = async () => {
    loading.value = true
    try {
        presets.value = await presetService.getAll()
    } catch (error) {
        console.error('Error fetching presets:', error)
        Swal.fire('Error', 'No se pudieron cargar los presets', 'error')
    } finally {
        loading.value = false
    }
}

const filteredPresets = computed(() => {
    if (!searchQuery.value) return presets.value
    const query = searchQuery.value.toLowerCase()
    return presets.value.filter(p => 
        p.nombre?.toLowerCase().includes(query) || 
        p.descripcion?.toLowerCase().includes(query)
    )
})

const openCreateModal = () => {
    selectedPreset.value = null
    isModalOpen.value = true
}

const openEditModal = (preset: Preset) => {
    selectedPreset.value = preset
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    selectedPreset.value = null
}

const savePreset = async (formData: Preset) => {
    saving.value = true
    try {
        if (selectedPreset.value?.id) {
            await presetService.update(selectedPreset.value.id, formData)
            Swal.fire({
                title: '¡Actualizado!',
                text: 'El preset se ha actualizado correctamente.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            })
        } else {
            await presetService.create(formData)
            Swal.fire({
                title: '¡Creado!',
                text: 'El preset se ha creado correctamente.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            })
        }
        closeModal()
        fetchPresets()
    } catch (error) {
        console.error('Error saving preset:', error)
        Swal.fire('Error', 'Ocurrió un error al guardar el preset', 'error')
    } finally {
        saving.value = false
    }
}

const confirmDelete = async (preset: Preset) => {
    if (!preset.id) return
    
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Vas a eliminar el preset "${preset.nombre}". Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
    })

    if (result.isConfirmed) {
        try {
            await presetService.delete(preset.id)
            Swal.fire('¡Eliminado!', 'El preset ha sido eliminado.', 'success')
            fetchPresets()
        } catch (error) {
            console.error('Error deleting preset:', error)
            Swal.fire('Error', 'No se pudo eliminar el preset', 'error')
        }
    }
}

const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'Q0.00'
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(value)
}

onMounted(fetchPresets)
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
    opacity: 1;
}
</style>
