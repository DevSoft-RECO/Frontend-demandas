<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div 
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {{ isEdit ? 'Editar Preset' : 'Nuevo Preset' }}
          </h3>
          <button @click="close" class="text-white/80 hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <form @submit.prevent="submit" class="space-y-6">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="col-span-full">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nombre del Preset *</label>
                <input 
                  v-model="form.nombre" 
                  type="text" 
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Ej. Comercial Estándar"
                >
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Rango Mínimo (Q)</label>
                <input 
                  v-model.number="form.rango_min" 
                  type="number" 
                  step="0.01"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                >
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Rango Máximo (Q)</label>
                <input 
                  v-model.number="form.rango_max" 
                  type="number" 
                  step="0.01"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                >
              </div>
            </div>

            <!-- Porcentajes -->
            <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-4 border border-gray-100 dark:border-gray-700">
              <h4 class="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Porcentajes de Etapas (%)</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Total Comis.</label>
                  <input v-model.number="form.porcentaje_comision" type="number" step="0.01" class="w-full px-3 py-1.5 rounded-md border dark:bg-gray-700 dark:border-gray-600">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Etapa 1</label>
                  <input v-model.number="form.p_etapa_1" type="number" step="0.01" class="w-full px-3 py-1.5 rounded-md border dark:bg-gray-700 dark:border-gray-600">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Etapa 2</label>
                  <input v-model.number="form.p_etapa_2" type="number" step="0.01" class="w-full px-3 py-1.5 rounded-md border dark:bg-gray-700 dark:border-gray-600">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Etapa 3</label>
                  <input v-model.number="form.p_etapa_3" type="number" step="0.01" class="w-full px-3 py-1.5 rounded-md border dark:bg-gray-700 dark:border-gray-600">
                </div>
                <div class="col-start-1">
                   <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Etapa 4</label>
                   <input v-model.number="form.p_etapa_4" type="number" step="0.01" class="w-full px-3 py-1.5 rounded-md border dark:bg-gray-700 dark:border-gray-600">
                </div>
              </div>
            </div>

            <!-- Montos Fijos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Monto Pago Único (Q)</label>
                <input 
                  v-model.number="form.monto_pago_unico" 
                  type="number" 
                  step="0.01"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                >
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Monto Desestimación (Q)</label>
                <input 
                  v-model.number="form.monto_desestimacion" 
                  type="number" 
                  step="0.01"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea 
                v-model="form.descripcion" 
                rows="3"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Detalles adicionales..."
              ></textarea>
            </div>

            <div class="flex items-center gap-2">
              <input v-model="form.activo" type="checkbox" id="activo" class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <label for="activo" class="text-sm font-semibold text-gray-700 dark:text-gray-300">Preset Activo</label>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button 
            @click="close"
            class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold transition"
          >
            Cancelar
          </button>
          <button 
            @click="submit"
            :disabled="loading"
            class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition disabled:opacity-50"
          >
            {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Preset') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Preset } from '@/types/preset'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  initialData: Preset | null
  loading: boolean
}>()

const emit = defineEmits(['close', 'save'])

const form = ref<Preset>({
  nombre: '',
  rango_min: 0,
  rango_max: 0,
  porcentaje_comision: 0,
  p_etapa_1: 0,
  p_etapa_2: 0,
  p_etapa_3: 0,
  p_etapa_4: 0,
  monto_pago_unico: 0,
  monto_desestimacion: 600,
  descripcion: '',
  activo: true
})

watch(() => props.isOpen, (val) => {
  if (val) {
    if (props.isEdit && props.initialData) {
      form.value = { ...props.initialData }
    } else {
      resetForm()
    }
  }
})

const resetForm = () => {
  form.value = {
    nombre: '',
    rango_min: 0,
    rango_max: 0,
    porcentaje_comision: 0,
    p_etapa_1: 0,
    p_etapa_2: 0,
    p_etapa_3: 0,
    p_etapa_4: 0,
    monto_pago_unico: 0,
    monto_desestimacion: 600,
    descripcion: '',
    activo: true
  }
}

const close = () => {
  emit('close')
}

const submit = () => {
  emit('save', form.value)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
