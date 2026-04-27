<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h3 class="text-xl font-black tracking-tight flex items-center gap-2">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Liquidación de Desembolso
            </h3>
            <p class="text-slate-400 text-sm font-medium mt-1">Crédito: {{ detalle?.seguimiento?.demanda?.no_credito }} | Deudor: {{ detalle?.seguimiento?.demanda?.deudor }}</p>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-white/10 rounded-full transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div v-if="loading" class="p-20 flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>

        <!-- Content -->
        <div v-else class="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-slate-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-slate-100 dark:border-gray-700">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comisión Total</p>
              <p class="text-xl font-black text-slate-800 dark:text-white">{{ formatCurrency(detalle?.total_comision) }}</p>
            </div>
            <div class="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
              <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Pagado</p>
              <p class="text-xl font-black text-emerald-700 dark:text-emerald-400">{{ formatCurrency(detalle?.total_pagado) }}</p>
            </div>
            <div class="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Saldo Pendiente</p>
              <p class="text-xl font-black text-amber-700 dark:text-amber-400">{{ formatCurrency(detalle?.saldo_restante) }}</p>
            </div>
          </div>

          <!-- Stages Payment Table -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-gray-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                  <th class="px-6 py-4">Etapa Procesal</th>
                  <th class="px-6 py-4">Monto Pactado</th>
                  <th class="px-6 py-4 text-center">Estado de Pago</th>
                  <th class="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-gray-700">
                <tr v-for="n in 4" :key="n" class="hover:bg-slate-50 dark:hover:bg-gray-900/20 transition-colors">
                  <td class="px-6 py-4">
                    <p class="text-sm font-bold text-slate-800 dark:text-white">{{ getEtapaLabel(n) }}</p>
                    <p v-if="isAdvised(n)" class="text-[9px] font-bold text-amber-600 uppercase mt-0.5 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Pago Anticipado
                    </p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm font-black text-slate-700 dark:text-slate-300">{{ formatCurrency(getPactado(n)) }}</p>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span 
                      v-if="isPaid(n)"
                      class="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase"
                    >
                      Pagado
                    </span>
                    <span 
                      v-else
                      class="px-3 py-1 bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-gray-400 rounded-full text-[10px] font-black uppercase"
                    >
                      Pendiente
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      v-if="!isPaid(n)"
                      @click="handlePayment(n)"
                      :disabled="isExceedingLimit(n) || processing === n"
                      class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {{ processing === n ? '...' : 'Registrar Pago' }}
                    </button>
                    <div v-else class="text-[10px] font-bold text-slate-400">
                        {{ formatDate(getFechaPago(n)) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Alert for Stage 1 -->
          <div v-if="isExceedingLimit(1)" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-start gap-3">
            <svg class="w-6 h-6 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
                <p class="text-xs font-black text-red-800 dark:text-red-300 uppercase tracking-tight">Bloqueo de Seguridad: Etapa 1</p>
                <p class="text-xs text-red-700 dark:text-red-400 mt-1">El monto pactado para la etapa 1 excede el 25% de la comisión total permitida por normativa. Verifique los presets o autorice pago único.</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 bg-slate-50 dark:bg-gray-900/50 border-t border-slate-100 dark:border-gray-700 flex justify-end">
            <button @click="$emit('close')" class="px-8 py-2 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition">Cerrar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { pagosService, type DetallePago } from '@/services/pagosService'
import Swal from 'sweetalert2'

const props = defineProps<{
  isOpen: boolean
  seguimientoId: number | null
}>()

const emit = defineEmits(['close', 'refresh'])

const detalle = ref<DetallePago | null>(null)
const loading = ref(false)
const processing = ref<number | null>(null)

const fetchDetalle = async () => {
    if (!props.seguimientoId) return
    loading.value = true
    try {
        detalle.value = await pagosService.getDetalleSeguimiento(props.seguimientoId)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

watch(() => props.isOpen, (newVal) => {
    if (newVal) fetchDetalle()
})

const getEtapaLabel = (n: number) => {
    const labels = ['', 'Presentación', 'Admisión', 'Notificación', 'Ejecución']
    return labels[n]
}

const getPactado = (n: number) => {
    if (!detalle.value) return 0
    return detalle.value.seguimiento[`pago_pactado_${n}`] || 0
}

const isPaid = (n: number) => {
    if (!detalle.value) return false
    return detalle.value.seguimiento[`is_pagado_${n}`] || false
}

const getFechaPago = (n: number) => {
    if (!detalle.value) return null
    return detalle.value.seguimiento[`fecha_pago_${n}`]
}

const isAdvised = (n: number) => {
    if (!detalle.value) return false
    const legalStage = detalle.value.seguimiento.estado_seguimiento || 1
    return n > legalStage
}

const isExceedingLimit = (n: number) => {
    if (n !== 1 || !detalle.value) return false
    const s = detalle.value.seguimiento
    if (s.pago_unico > 0) return false // No aplica si es pago único
    return getPactado(1) > (detalle.value.total_comision * 0.2501)
}

const handlePayment = async (etapa: number) => {
    if (!props.seguimientoId) return
    
    // Alerta de pago muy adelantado (Etapa 4 vs Etapa 1 legal)
    const legalStage = detalle.value?.seguimiento?.estado_seguimiento || 1
    if (etapa === 4 && legalStage === 1) {
        const { isConfirmed } = await Swal.fire({
            title: '¿Confirmar Pago Adelantado?',
            text: 'El abogado aún se encuentra en etapa de Presentación. ¿Está seguro de pagar la Liquidación de Ejecución?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            confirmButtonColor: '#10b981'
        })
        if (!isConfirmed) return
    }

    processing.value = etapa
    try {
        await pagosService.registrarDesembolso(props.seguimientoId, etapa)
        await fetchDetalle()
        emit('refresh')
        Swal.fire({
            icon: 'success',
            title: 'Desembolso Registrado',
            timer: 1500,
            showConfirmButton: false
        })
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.detail || 'No se pudo registrar el pago', 'error')
    } finally {
        processing.value = null
    }
}

const formatCurrency = (val: number | undefined) => {
    if (val === undefined) return 'Q0.00'
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(val)
}

const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-GT')
}
</script>

<style scoped>
@reference "@/assets/main.css";
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
