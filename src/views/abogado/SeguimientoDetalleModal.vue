<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white flex justify-between items-center">
          <div>
            <h3 class="text-xl font-black tracking-tight flex items-center gap-2">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Seguimiento Procesal: {{ seguimiento?.demanda?.no_credito || seguimiento?.demanda?.no_credito_t24 || 'N/A' }}
            </h3>
            <p class="text-slate-400 text-sm font-medium mt-1">Deudor: {{ seguimiento?.demanda?.deudor }} | Juicio: {{ seguimiento?.demanda?.no_juicio || 'No disponible' }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span 
              class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2"
              :class="statusColor"
            >
              {{ seguimiento?.estado_legal_demanda }}
            </span>
            <button @click="close" class="p-2 hover:bg-white/10 rounded-full transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <!-- Stepper -->
          <div class="mb-12 relative flex justify-between">
            <div class="absolute top-5 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-0"></div>
            <div 
                class="absolute top-5 left-0 h-1 bg-emerald-500 transition-all duration-500 -z-0"
                :style="{ width: stepperProgress + '%' }"
            ></div>
            
            <button 
              v-for="step in steps" 
              :key="step.id"
              @click="activeTab = step.id"
              class="relative z-10 flex flex-col items-center group"
            >
              <div 
                class="w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all duration-300"
                :class="[
                  activeTab === step.id ? 'scale-125 shadow-lg shadow-emerald-500/20' : '',
                  step.id < (seguimiento?.estado_seguimiento || 1) ? 'bg-emerald-500 border-emerald-500 text-white' : 
                  step.id === (seguimiento?.estado_seguimiento || 1) ? 'bg-white dark:bg-gray-800 border-emerald-500 text-emerald-600' : 
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                ]"
              >
                <svg v-if="step.id < (seguimiento?.estado_seguimiento || 1)" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                <span v-else class="font-black">{{ step.id }}</span>
              </div>
              <span 
                class="mt-3 text-[10px] font-black uppercase tracking-widest transition-colors"
                :class="activeTab === step.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'"
              >
                {{ step.label }}
              </span>
            </button>
          </div>

          <!-- Tab Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Timeline de Comentarios -->
            <div class="lg:col-span-2 space-y-6">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  Bitácora de Etapa: {{ currentStepLabel }}
                </h4>
                <div v-if="isLocked" class="flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                  Solo Lectura
                </div>
              </div>

              <div class="space-y-4 min-h-[300px]">
                <div v-if="bitacora.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <svg class="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p class="text-xs font-bold uppercase tracking-tighter">Sin registros en esta etapa</p>
                </div>
                
                <div v-for="entry in bitacora" :key="entry.id" class="flex gap-4">
                    <div class="flex flex-col items-center">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 mt-2 ring-4 ring-emerald-500/20"></div>
                        <div class="flex-1 w-px bg-gray-200 dark:bg-gray-700 my-1 group-last:hidden"></div>
                    </div>
                    <div class="flex-1 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{{ formatDate(entry.fecha) }}</span>
                            <a v-if="entry.documento" :href="getDocumentUrl(entry.documento)" target="_blank" class="px-3 py-1 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition flex items-center gap-1.5 shadow-sm">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                Ver Evidencia
                            </a>
                        </div>
                        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ entry.comentario }}</p>
                    </div>
                </div>
              </div>

              <!-- Input de Comentario (Solo si etapa activa y vigente) -->
              <div v-if="canEdit" class="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                <label class="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3">Nuevo Comentario Legal</label>
                <div class="relative">
                  <textarea 
                    v-model="newComment"
                    rows="3"
                    class="w-full p-4 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all custom-scrollbar mb-14"
                    placeholder="Escribe los avances legales de esta etapa..."
                  ></textarea>

                  <div class="absolute bottom-4 left-4 flex items-center">
                    <label class="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        <span class="truncate max-w-[150px]">{{ newFile ? newFile.name : 'Adjuntar PDF (Opcional)' }}</span>
                        <input type="file" ref="fileInput" @change="onFileChange" accept=".pdf" class="hidden" />
                    </label>
                    <button v-if="newFile" @click="clearFile" class="ml-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Quitar archivo">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <button 
                    @click="saveComment"
                    :disabled="!newComment.trim() || saving"
                    class="absolute bottom-4 right-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {{ saving ? 'Guardando...' : 'Registrar' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Acciones de Estado -->
            <div class="space-y-6">
              <div class="bg-gray-50 dark:bg-gray-900/40 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                <h5 class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Acciones de Proceso</h5>
                <div class="space-y-3">
                  <button 
                    v-if="canEdit"
                    @click="confirmAvanzar"
                    class="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-emerald-600 hover:text-white rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 group transition-all duration-300 shadow-sm"
                  >
                    <span class="text-xs font-black uppercase tracking-widest">Finalizar Etapa Activa</span>
                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>

                  <button 
                    v-if="!readonly && seguimiento?.estado_legal_demanda === 'Vigente'"
                    @click="confirmDesistir"
                    class="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-red-600 hover:text-white rounded-2xl border-2 border-red-100 dark:border-red-900/30 group transition-all duration-300 shadow-sm"
                  >
                    <span class="text-xs font-black uppercase tracking-widest">Finalización Anticipada</span>
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  </button>
                </div>

                <div v-if="!readonly" class="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-[10px] font-medium text-emerald-800 dark:text-emerald-300 leading-relaxed italic">
                  * Al finalizar una etapa, esta se bloquea permanentemente para edición y el proceso avanza a la siguiente fase legal.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { seguimientoAbogadoService } from '@/services/seguimientoAbogadoService'
import Swal from 'sweetalert2'

const props = withDefaults(defineProps<{
  isOpen: boolean
  seguimiento: any
  readonly?: boolean
}>(), {
  readonly: false
})

const emit = defineEmits(['close', 'refresh'])

const activeTab = ref(1)
const newComment = ref('')
const newFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const saving = ref(false)

const steps = [
  { id: 1, label: 'Presentación' },
  { id: 2, label: 'Admisión' },
  { id: 3, label: 'Notificación' },
  { id: 4, label: 'Ejecución' }
]

const currentStepLabel = computed(() => steps.find(s => s.id === activeTab.value)?.label)

const stepperProgress = computed(() => {
    const current = props.seguimiento?.estado_seguimiento || 1
    if (current >= 4) return 100
    return (current - 1) * 33.33
})

const isLocked = computed(() => {
    if (props.readonly) return true
    return activeTab.value < (props.seguimiento?.estado_seguimiento || 1)
})
const canEdit = computed(() => {
    if (props.readonly) return false
    return activeTab.value === props.seguimiento?.estado_seguimiento && 
           props.seguimiento?.estado_legal_demanda === 'Vigente'
})

const bitacora = computed(() => {
    if (!props.seguimiento) return []
    const field = `etapa_${activeTab.value}_json`
    return props.seguimiento[field] || []
})

const statusColor = computed(() => {
  const s = props.seguimiento?.estado_legal_demanda
  if (s === 'Vigente') return 'text-emerald-600 border-emerald-100 bg-emerald-50'
  if (s === 'Finalizado') return 'text-blue-600 border-blue-100 bg-blue-50'
  return 'text-red-600 border-red-100 bg-red-50'
})

watch(() => props.isOpen, (val) => {
    if (val && props.seguimiento) {
        activeTab.value = Math.min(props.seguimiento.estado_seguimiento, 4)
    }
})

const close = () => emit('close')

const saveComment = async () => {
    if (!newComment.value.trim()) return
    saving.value = true
    try {
        await seguimientoAbogadoService.addComentario(props.seguimiento.id, activeTab.value, newComment.value, newFile.value)
        newComment.value = ''
        clearFile()
        emit('refresh')
        Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: 'Comentario agregado a la bitácora',
            timer: 1500,
            showConfirmButton: false
        })
    } catch (error) {
        Swal.fire('Error', 'No se pudo guardar el comentario', 'error')
    } finally {
        saving.value = false
    }
}

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        newFile.value = target.files[0]
    }
}

const clearFile = () => {
    newFile.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const getDocumentUrl = (path: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
    return `${baseUrl}${path}`
}

const confirmAvanzar = async () => {
    const { isConfirmed } = await Swal.fire({
        title: '¿Confirmar Avance?',
        text: `Se cerrará la etapa de ${currentStepLabel.value} y el proceso avanzará a la siguiente fase. Esta acción no se puede deshacer.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, avanzar etapa',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#059669'
    })

    if (isConfirmed) {
        try {
            await seguimientoAbogadoService.avanzarEtapa(props.seguimiento.id)
            emit('refresh')
            Swal.fire('Proceso Actualizado', 'La etapa ha sido completada.', 'success')
            if (activeTab.value < 4) activeTab.value++
        } catch (error) {
            Swal.fire('Error', 'No se pudo avanzar la etapa', 'error')
        }
    }
}

const confirmDesistir = async () => {
    const { isConfirmed } = await Swal.fire({
        title: '¿Reportar Finalización Anticipada?',
        text: 'Esta acción marcará el proceso como Desistido y bloqueará futuras ediciones.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, reportar',
        confirmButtonColor: '#dc2626'
    })

    if (isConfirmed) {
        try {
            await seguimientoAbogadoService.desistir(props.seguimiento.id)
            emit('refresh')
            Swal.fire('Actualizado', 'El proceso ha sido marcado como desistido.', 'success')
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error')
        }
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>

<style scoped>
@reference "@/assets/main.css";

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
