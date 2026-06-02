<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div 
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all"
        :class="isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ isEdit ? 'Editar Demanda' : 'Nueva Demanda' }}
          </h3>
          <button @click="close" class="text-white/80 hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <form @submit.prevent="submit" class="space-y-8">
            
            <!-- Sección 1: Identificación -->
            <div class="space-y-4">
              <h4 class="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
                Identificación del Crédito
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Agencia Asociada *</label>
                  <select v-model="form.id_agencia" required class="form-input">
                    <option :value="null">Seleccione una agencia...</option>
                    <option v-for="agencia in agencias" :key="agencia.id" :value="agencia.id">
                      {{ agencia.nombre }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">No. Crédito</label>
                  <input v-model="form.no_credito" type="text" class="form-input" placeholder="Ej. 12345678">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">CIF</label>
                  <input v-model="form.cif" type="text" class="form-input" placeholder="Ej. 9876543">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Código Cliente</label>
                  <input v-model="form.codigo_cliente" type="text" class="form-input">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">No. Crédito T24</label>
                  <input v-model="form.no_credito_t24" type="text" class="form-input">
                </div>
              </div>
            </div>

            <!-- Sección 2: Deudor y Proceso -->
            <div class="space-y-4">
              <h4 class="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Información del Deudor y Juicio
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deudor</label>
                  <input v-model="form.deudor" type="text" class="form-input" placeholder="Nombre completo">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">No. Juicio</label>
                  <input v-model="form.no_juicio" type="text" class="form-input" placeholder="Ej. 01048-2023-00123">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Fecha Ingreso Demanda</label>
                  <input v-model="form.fecha_ingreso_demanda" type="text" class="form-input" placeholder="Ej. 15/03/2023">
                </div>
                <div class="md:col-span-2 relative">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Abogado (Origen Excel)</label>
                  <div class="relative">
                    <input 
                      v-model="form.abogado_nombre_excel" 
                      type="text" 
                      class="form-input pr-10" 
                      placeholder="Nombre del abogado según Excel"
                      @focus="showAbogadosDropdown = true"
                      @blur="showAbogadosDropdown = false"
                    >
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none text-gray-400 dark:text-gray-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    <Transition name="fade-fast">
                      <div 
                        v-if="showAbogadosDropdown" 
                        class="absolute z-10 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 space-y-1 custom-scrollbar"
                      >
                        <div v-if="filteredAbogados.length === 0" class="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 text-center uppercase tracking-wider font-semibold">
                          No se encontraron abogados
                        </div>
                        <button
                          v-for="abogado in filteredAbogados"
                          :key="abogado.id"
                          type="button"
                          @mousedown.prevent="selectAbogado(abogado.nombre)"
                          class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/60 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition flex items-center justify-between"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{{ abogado.nombre }}</span>
                          </div>
                          <span class="text-[9px] font-black px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 uppercase tracking-widest">ID: {{ abogado.id }}</span>
                        </button>
                      </div>
                    </Transition>
                  </div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Fiadores</label>
                  <textarea v-model="form.fiadores" rows="2" class="form-input" placeholder="Nombres de fiadores..."></textarea>
                </div>
                <div class="md:col-span-2">
                   <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Salario Embargado A</label>
                   <input v-model="form.salario_embargado_a" type="text" class="form-input">
                </div>
              </div>
            </div>

            <!-- Sección 3: Montos y Legal -->
            <div class="space-y-4">
              <h4 class="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Detalles Financieros y Legales
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Monto Demanda (Q)</label>
                  <input v-model.number="form.monto_demanda" type="number" step="0.01" class="form-input">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Costas Judiciales (Q)</label>
                  <input v-model.number="form.costas_judiciales" type="number" step="0.01" class="form-input">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Costas Recuperadas</label>
                  <select v-model="form.costas_recuperadas" class="form-input">
                    <option value="">Seleccione...</option>
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Situación</label>
                  <input v-model="form.situacion" type="text" class="form-input">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Forma Resolución</label>
                  <input v-model="form.forma_resolucion" type="text" class="form-input">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Estado Legal</label>
                  <select v-model="form.estado_legal" class="form-input">
                    <option value="Vigente">Vigente</option>
                    <option value="Desistido">Desistido</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Suspendido">Suspendido</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Sección 4: Observaciones -->
            <div class="space-y-4">
              <h4 class="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                <span class="w-2 h-2 bg-amber-600 rounded-full"></span>
                Seguimiento y Observaciones
              </h4>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Seguimiento Legal (Histórico)</label>
                  <textarea v-model="form.seguimiento_legacy" rows="4" class="form-input text-xs font-mono"></textarea>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Observación 1</label>
                    <textarea v-model="form.observacion_1" rows="3" class="form-input"></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Observación 2</label>
                    <textarea v-model="form.observacion_2" rows="3" class="form-input"></textarea>
                  </div>
                </div>
              </div>
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
            {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar Registro' : 'Crear Registro') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { Demanda } from '@/types/demanda'
import type { Agencia } from '@/types/agencia'
import type { Bufete } from '@/types/bufete'
import { agenciaService } from '@/services/agenciaService'
import { bufeteService } from '@/services/bufeteService'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  initialData: Demanda | null
  loading: boolean
}>()

const emit = defineEmits(['close', 'save'])

const agencias = ref<Agencia[]>([])
const abogados = ref<Bufete[]>([])
const showAbogadosDropdown = ref(false)

const fetchCatalogs = async () => {
    try {
        const [agList, abList] = await Promise.all([
            agenciaService.getAll(),
            bufeteService.getAll()
        ])
        agencias.value = agList
        abogados.value = abList
    } catch (error) {
        console.error('Error fetching catalogs:', error)
    }
}

onMounted(fetchCatalogs)

const filteredAbogados = computed(() => {
  const query = (form.value.abogado_nombre_excel || '').trim().toLowerCase()
  const uniqueAbogados = abogados.value.filter((abogado, index, self) => 
    abogado.nombre && self.findIndex(a => a.nombre === abogado.nombre) === index
  )
  if (!query) {
    return uniqueAbogados
  }
  return uniqueAbogados.filter(abogado => 
    abogado.nombre!.toLowerCase().includes(query)
  )
})

const selectAbogado = (nombre: string | null | undefined) => {
  form.value.abogado_nombre_excel = nombre || ''
  showAbogadosDropdown.value = false
}

const form = ref<Partial<Demanda>>({
  id_agencia: null,
  no_credito: '',
  cif: '',
  codigo_cliente: '',
  no_credito_t24: '',
  deudor: '',
  fiadores: '',
  salario_embargado_a: '',
  no_juicio: '',
  fecha_ingreso_demanda: '',
  abogado_nombre_excel: '',
  monto_demanda: 0,
  situacion: '',
  forma_resolucion: '',
  costas_judiciales: 0,
  costas_recuperadas: '',
  observacion_1: '',
  estado_legal: 'Vigente',
  seguimiento_legacy: '',
  observacion_2: ''
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
    id_agencia: null,
    no_credito: '',
    cif: '',
    codigo_cliente: '',
    no_credito_t24: '',
    deudor: '',
    fiadores: '',
    salario_embargado_a: '',
    no_juicio: '',
    fecha_ingreso_demanda: '',
    abogado_nombre_excel: '',
    monto_demanda: 0,
    situacion: '',
    forma_resolucion: '',
    costas_judiciales: 0,
    costas_recuperadas: '',
    observacion_1: '',
    estado_legal: 'Vigente',
    seguimiento_legacy: '',
    observacion_2: ''
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
@reference "@/assets/main.css";

.form-input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition outline-none;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-fast-enter-active, .fade-fast-leave-active { transition: opacity 0.15s ease; }
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
