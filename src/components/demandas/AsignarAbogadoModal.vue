<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div 
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {{ demanda?.seguimiento ? 'Reasignar / Actualizar Seguimiento' : 'Asignar Abogado a Expediente' }}
          </h3>
          <button @click="close" class="text-white/80 hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div v-if="demanda" class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <span class="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Deudor</span>
                    <p class="text-sm font-bold text-gray-900 dark:text-white uppercase">{{ demanda.deudor }}</p>
                </div>
                <div>
                    <span class="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Monto Demanda</span>
                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(demanda.monto_demanda) }}</p>
                </div>
            </div>
            <div v-if="form.id_preset > 0 || demanda?.seguimiento" class="mt-4 p-3 bg-emerald-600 rounded-xl text-white flex items-center justify-between shadow-lg shadow-emerald-500/20">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-white/20 rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase opacity-80 tracking-widest">Total Comisión Pactada</p>
                        <p class="text-lg font-black">{{ formatCurrency(totalCommissionAmount) }} ({{ form.porcentaje_comision }}%)</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-black uppercase opacity-80 tracking-widest">Restante por Distribuir</p>
                    <p class="text-lg font-black" :class="remainingCommission < 0 ? 'text-red-200' : ''">
                        {{ formatCurrency(remainingCommission) }}
                    </p>
                </div>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Selección de Abogado y Preset -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Seleccionar Abogado (Bufete) *</label>
                    <select v-model="form.id_abogado" class="form-input">
                        <option :value="0">Seleccione un abogado...</option>
                        <option v-for="abogado in abogados" :key="abogado.id" :value="abogado.id">
                            {{ abogado.nombre }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Plantilla de Pagos (Preset) - Opcional en Reasignación</label>
                    <select v-model="form.id_preset" class="form-input" @change="onPresetChange">
                        <option :value="0">Seleccione un preset...</option>
                        <option v-for="preset in presets" :key="preset.id" :value="preset.id">
                            {{ preset.nombre }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Global Financial Overrides -->
            <div v-if="form.id_preset > 0 || demanda?.seguimiento" class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                    <label class="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Pago Único</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-400">Q</span>
                        <input v-model.number="form.pago_unico" type="number" step="1" class="form-input !pl-8" placeholder="0" @input="roundField('pago_unico')">
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Monto Desestimación</label>
                    <div class="relative">
                        <span class="absolute left-3 top-2 text-gray-400">Q</span>
                        <input v-model.number="form.monto_desestimacion" type="number" step="1" class="form-input !pl-8" placeholder="0" @input="roundField('monto_desestimacion')">
                    </div>
                </div>
            </div>

            <!-- Tabla de Pagos Pactados -->
            <div v-if="form.id_preset > 0 || demanda?.seguimiento" class="mt-4 animate-in fade-in slide-in-from-top-2">
                <h4 class="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    Configuración de Pagos Pactados (Valores Enteros)
                </h4>
                <div class="bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-800">
                            <tr class="text-left text-[10px] font-black uppercase text-gray-500">
                                <th class="px-4 py-2">Etapa</th>
                                <th class="px-4 py-2 text-right">Sugerido (Redondeado)</th>
                                <th class="px-4 py-2 text-right">Pactado (Solo Enteros)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr>
                                <td class="px-4 py-3 font-medium">
                                    1. Presentación
                                    <p v-if="form.pago_pactado_1 > limitStage1" class="text-[9px] font-bold text-red-500 uppercase mt-1">Máximo permitido: 25% ({{ formatCurrency(limitStage1) }})</p>
                                </td>
                                <td class="px-4 py-3 text-right text-gray-500">{{ formatCurrency(form.sugerido1) }}</td>
                                <td class="px-4 py-3 text-right">
                                    <input 
                                        v-model.number="form.pago_pactado_1" 
                                        type="number" 
                                        step="1"
                                        class="w-32 px-2 py-1 bg-white dark:bg-gray-700 border rounded text-right outline-none transition"
                                        :class="form.pago_pactado_1 > limitStage1 ? 'border-red-500 focus:ring-2 focus:ring-red-500 text-red-600' : 'border-emerald-200 focus:ring-2 focus:ring-emerald-500'"
                                        @input="roundField('pago_pactado_1')"
                                    >
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">2. Admisión</td>
                                <td class="px-4 py-3 text-right text-gray-500">{{ formatCurrency(form.sugerido2) }}</td>
                                <td class="px-4 py-3 text-right">
                                    <input v-model.number="form.pago_pactado_2" type="number" step="1" class="w-32 px-2 py-1 bg-white dark:bg-gray-700 border border-emerald-200 rounded text-right focus:ring-2 focus:ring-emerald-500 outline-none transition" @input="roundField('pago_pactado_2')">
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">3. Notificación</td>
                                <td class="px-4 py-3 text-right text-gray-500">{{ formatCurrency(form.sugerido3) }}</td>
                                <td class="px-4 py-3 text-right">
                                    <input v-model.number="form.pago_pactado_3" type="number" step="1" class="w-32 px-2 py-1 bg-white dark:bg-gray-700 border border-emerald-200 rounded text-right focus:ring-2 focus:ring-emerald-500 outline-none transition" @input="roundField('pago_pactado_3')">
                                </td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">4. Ejecución</td>
                                <td class="px-4 py-3 text-right text-gray-500">{{ formatCurrency(form.sugerido4) }}</td>
                                <td class="px-4 py-3 text-right">
                                    <input v-model.number="form.pago_pactado_4" type="number" step="1" class="w-32 px-2 py-1 bg-white dark:bg-gray-700 border border-emerald-200 rounded text-right focus:ring-2 focus:ring-emerald-500 outline-none transition" @input="roundField('pago_pactado_4')">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
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
            :disabled="loading || form.id_abogado === 0"
            class="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {{ loading ? 'Guardando...' : (demanda?.seguimiento ? 'Actualizar Seguimiento' : 'Confirmar Asignación') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import Swal from 'sweetalert2'
import type { Demanda } from '@/types/demanda'
import type { Bufete } from '../../types/bufete'
import type { Preset } from '../../types/preset'
import { bufeteService } from '../../services/bufeteService'
import { presetService } from '../../services/presetService'

const props = defineProps<{
  isOpen: boolean
  demanda: Demanda | null
  loading: boolean
}>()

const emit = defineEmits(['close', 'save'])

const abogados = ref<Bufete[]>([])
const presets = ref<Preset[]>([])

const form = ref({
    id_abogado: 0,
    id_preset: 0,
    porcentaje_comision: 0,
    pago_unico: 0,
    monto_desestimacion: 0,
    sugerido1: 0,
    sugerido2: 0,
    sugerido3: 0,
    sugerido4: 0,
    pago_pactado_1: 0,
    pago_pactado_2: 0,
    pago_pactado_3: 0,
    pago_pactado_4: 0,
})

const fetchCatalogs = async () => {
    try {
        const [a, p] = await Promise.all([
            bufeteService.getAll(),
            presetService.getAll()
        ])
        abogados.value = a
        presets.value = p
    } catch (error) {
        console.error('Error fetching catalogs:', error)
    }
}

onMounted(fetchCatalogs)

watch(() => props.isOpen, (val) => {
    if (val) {
        resetForm()
    }
})

const totalCommissionAmount = computed(() => {
    const monto = props.demanda?.monto_demanda || 0
    return Math.round(monto * (form.value.porcentaje_comision / 100))
})

const totalPactadoSum = computed(() => {
    return (form.value.pago_pactado_1 || 0) + 
           (form.value.pago_pactado_2 || 0) + 
           (form.value.pago_pactado_3 || 0) + 
           (form.value.pago_pactado_4 || 0)
})

const remainingCommission = computed(() => {
    return totalCommissionAmount.value - totalPactadoSum.value
})

const limitStage1 = computed(() => {
    if (form.value.pago_unico > 0) return 999999999 
    return Math.round(totalCommissionAmount.value * 0.25)
})

const resetForm = () => {
    if (props.demanda?.seguimiento) {
        const s = props.demanda.seguimiento
        form.value = {
            id_abogado: s.id_abogado,
            id_preset: 0,
            porcentaje_comision: s.porcentaje_demanda,
            pago_unico: Math.round(s.pago_unico),
            monto_desestimacion: Math.round(s.monto_desestimacion),
            sugerido1: Math.round(s.pago_sugerido_1),
            sugerido2: Math.round(s.pago_sugerido_2),
            sugerido3: Math.round(s.pago_sugerido_3),
            sugerido4: Math.round(s.pago_sugerido_4),
            pago_pactado_1: Math.round(s.pago_pactado_1),
            pago_pactado_2: Math.round(s.pago_pactado_2),
            pago_pactado_3: Math.round(s.pago_pactado_3),
            pago_pactado_4: Math.round(s.pago_pactado_4),
        }
    } else {
        form.value = {
            id_abogado: 0,
            id_preset: 0,
            porcentaje_comision: 0,
            pago_unico: 0,
            monto_desestimacion: 0,
            sugerido1: 0,
            sugerido2: 0,
            sugerido3: 0,
            sugerido4: 0,
            pago_pactado_1: 0,
            pago_pactado_2: 0,
            pago_pactado_3: 0,
            pago_pactado_4: 0,
        }
    }
}

const roundField = (fieldName: keyof typeof form.value) => {
    const val = form.value[fieldName]
    if (typeof val === 'number') {
        form.value[fieldName] = Math.round(val)
    }
}

const onPresetChange = () => {
    const preset = presets.value.find(p => p.id === form.value.id_preset)
    if (preset && props.demanda && props.demanda.monto_demanda !== undefined && props.demanda.monto_demanda !== null) {
        const monto = props.demanda.monto_demanda
        form.value.porcentaje_comision = preset.porcentaje_comision || 0
        const totalComision = Math.round(monto * (form.value.porcentaje_comision / 100))
        
        form.value.pago_unico = Math.round(preset.monto_pago_unico || 0)
        form.value.monto_desestimacion = Math.round(preset.monto_desestimacion || 0)

        form.value.sugerido1 = Math.round(totalComision * ((preset.p_etapa_1 || 0) / 100))
        form.value.sugerido2 = Math.round(totalComision * ((preset.p_etapa_2 || 0) / 100))
        form.value.sugerido3 = Math.round(totalComision * ((preset.p_etapa_3 || 0) / 100))
        form.value.sugerido4 = Math.round(totalComision * ((preset.p_etapa_4 || 0) / 100))
        
        if (!props.demanda.seguimiento) {
            form.value.pago_pactado_1 = form.value.sugerido1
            form.value.pago_pactado_2 = form.value.sugerido2
            form.value.pago_pactado_3 = form.value.sugerido3
            form.value.pago_pactado_4 = form.value.sugerido4
        }
    }
}

const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'Q0'
    return new Intl.NumberFormat('es-GT', { 
        style: 'currency', 
        currency: 'GTQ',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value)
}

const close = () => emit('close')
const submit = async () => {
    if (form.value.pago_unico === 0) {
        if (form.value.pago_pactado_1 > limitStage1.value) {
            await Swal.fire({
                title: 'Límite Etapa 1 Excedido',
                text: `El pago pactado para la etapa de Presentación no puede superar el 25% de la comisión total (${formatCurrency(limitStage1.value)}).`,
                icon: 'error',
                confirmButtonColor: '#10b981'
            })
            return
        }
    }

    if (remainingCommission.value < 0) { 
        await Swal.fire({
            title: 'Límite de Comisión Excedido',
            text: 'La suma de los pagos pactados no puede superar el monto total de la comisión calculada.',
            icon: 'warning',
            confirmButtonColor: '#10b981'
        })
        return
    }

    emit('save', {
        id_demanda: props.demanda?.id,
        id_abogado: form.value.id_abogado,
        id_preset: form.value.id_preset,
        pago_unico: Math.round(form.value.pago_unico || 0),
        monto_desestimacion: Math.round(form.value.monto_desestimacion || 0),
        pago_pactado_1: Math.round(form.value.pago_pactado_1 || 0),
        pago_pactado_2: Math.round(form.value.pago_pactado_2 || 0),
        pago_pactado_3: Math.round(form.value.pago_pactado_3 || 0),
        pago_pactado_4: Math.round(form.value.pago_pactado_4 || 0)
    })
}
</script>

<style scoped>
@reference "@/assets/main.css";

.form-input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition outline-none;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
