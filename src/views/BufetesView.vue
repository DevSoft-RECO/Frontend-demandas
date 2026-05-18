<template>
  <div class="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
    <!-- Header Corporativo -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-gray-700 pb-8">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-3">
          <div class="w-2 h-10 bg-indigo-600 rounded-full"></div>
          Gestión de <span class="text-indigo-600">Bufetes Jurídicos</span>
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">Administración de Firmas y Abogados Autorizados</p>
      </div>

      <button
        class="inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 text-xs font-black text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest group"
        @click="openCreateModal"
      >
        <UserPlusIcon class="w-5 h-5 group-hover:rotate-12 transition-transform" />
        Registrar Nuevo Bufete
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-slate-100 dark:border-gray-700 shadow-sm flex items-center gap-5">
            <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                <BuildingOfficeIcon class="w-8 h-8 text-indigo-600" />
            </div>
            <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bufetes</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white">{{ bufetes.length }}</p>
            </div>
        </div>
    </div>

    <!-- Empty State -->
    <div v-if="bufetes.length === 0 && !loading" class="bg-slate-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-gray-700 p-20 text-center">
        <BuildingOfficeIcon class="w-16 h-16 text-slate-300 mx-auto mb-4 opacity-20" />
        <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">No hay bufetes registrados</h3>
        <p class="text-xs text-slate-400 mt-2">Comienza agregando un nuevo bufete asignado a un usuario.</p>
    </div>

    <!-- Bufetes Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="b in bufetes"
        :key="b.id"
        class="group relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
               dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
        
        <div class="flex items-start justify-between mb-6 relative z-10">
          <div class="p-3 bg-slate-50 dark:bg-gray-900/50 rounded-2xl">
            <BuildingOffice2Icon class="w-6 h-6 text-indigo-600" />
          </div>
          <div class="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
            <span class="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">ID: {{ b.id }}</span>
          </div>
        </div>

        <div class="relative z-10">
          <h3 class="text-lg font-black text-slate-800 dark:text-white truncate uppercase">{{ b.nombre || 'Sin nombre' }}</h3>
          <div class="flex items-center gap-2 mt-2">
            <PhoneIcon class="w-3 h-3 text-slate-400" />
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
                {{ b.telefono || 'Sin teléfono' }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-50 dark:border-gray-700 flex items-center justify-between relative z-10">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                    U
                </div>
                <div>
                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Usuario Vinculado</p>
                    <p class="text-[10px] font-bold text-slate-700 dark:text-indigo-400 uppercase tracking-tighter">UID #{{ b.usuario_id }}</p>
                </div>
            </div>
            
            <button class="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <TrashIcon class="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>

    <!-- Modal Registro Bufete -->
    <Transition name="modal">
        <div v-if="isCreateOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="closeCreateModal"></div>

            <div class="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                <!-- Header Modal -->
                <div class="p-8 border-b border-slate-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/50">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <UserPlusIcon class="w-6 h-6" />
                        </div>
                        <div>
                            <h2 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Nueva Asignación</h2>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Vinculación de abogado a bufete</p>
                        </div>
                    </div>
                    <button @click="closeCreateModal" class="p-2 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>

                <!-- Formulario -->
                <div class="p-8 overflow-y-auto custom-scrollbar space-y-8">
                    <!-- Buscador de Usuarios -->
                    <div class="space-y-4">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MagnifyingGlassIcon class="w-4 h-4" />
                            1. Buscar Abogado por Nombre
                        </label>
                        <div class="relative">
                            <input
                                v-model="userQuery"
                                type="text"
                                class="w-full pl-6 pr-32 py-4 bg-slate-50 dark:bg-gray-950 border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none transition-all font-bold text-sm text-slate-700 dark:text-white shadow-inner"
                                placeholder="Escribe para buscar en el directorio..."
                                @input="debouncedSearch()"
                            />
                            <div class="absolute right-2 top-2">
                                <button
                                    class="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-30"
                                    :disabled="isSearching || userQuery.trim().length === 0"
                                    @click="searchUsuarios"
                                >
                                    {{ isSearching ? '...' : 'Buscar' }}
                                </button>
                            </div>
                        </div>

                        <!-- Resultados -->
                        <div v-if="usuarios.length > 0" class="mt-4 grid gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            <button
                                v-for="u in filteredSearchResults"
                                :key="u.id"
                                class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl hover:border-indigo-600 hover:shadow-lg transition-all group disabled:opacity-50"
                                :disabled="isUserAlreadyAssigned(u.id)"
                                @click="selectUsuario(u)"
                            >
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 bg-slate-100 dark:bg-gray-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <UserIcon class="w-5 h-5" />
                                    </div>
                                    <div class="text-left">
                                        <p class="text-sm font-black text-slate-800 dark:text-white uppercase">{{ u.name || u.username }}</p>
                                        <p class="text-[10px] font-bold text-slate-400 uppercase">{{ u.email || 'Sin correo' }}</p>
                                    </div>
                                </div>
                                <div v-if="isUserAlreadyAssigned(u.id)" class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 text-[8px] font-black uppercase rounded-lg">
                                    Ya Asignado
                                </div>
                                <div v-else class="w-8 h-8 rounded-full border-2 border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-300 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all">
                                    <PlusIcon class="w-4 h-4" />
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Confirmación Selección -->
                    <Transition name="fade">
                        <div v-if="selectedUsuario" class="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 rounded-3xl">
                            <label class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-4">2. Confirmar Datos del Bufete</label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p class="text-[9px] font-black text-slate-400 uppercase mb-2">Nombre Comercial</p>
                                    <input v-model="form.nombre" type="text" class="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm font-bold outline-none" />
                                </div>
                                <div>
                                    <p class="text-[9px] font-black text-slate-400 uppercase mb-2">Contacto Directo</p>
                                    <input v-model="form.telefono" type="text" class="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm font-bold outline-none" />
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Footer Modal -->
                <div class="p-8 bg-slate-50/50 dark:bg-gray-800/50 border-t border-slate-100 dark:border-gray-800 flex justify-end gap-3 rounded-b-[2.5rem]">
                    <button
                        class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                        @click="closeCreateModal"
                    >
                        Descartar
                    </button>
                    <button
                        class="px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 dark:shadow-indigo-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        :disabled="isSaving || !canSave"
                        @click="createBufete"
                    >
                        {{ isSaving ? 'Registrando...' : 'Finalizar Registro' }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api/axios'
import { 
    BuildingOfficeIcon, 
    UserPlusIcon, 
    BuildingOffice2Icon,
    PhoneIcon,
    TrashIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    UserIcon,
    PlusIcon
} from '@heroicons/vue/24/outline'

type Usuario = {
  id: number
  name?: string | null
  username?: string | null
  email?: string | null
  telefono?: string | null
}

type Bufete = {
  id: number
  usuario_id?: number | null
  nombre?: string | null
  telefono?: string | null
}

const bufetes = ref<Bufete[]>([])
const loading = ref(true)
const isCreateOpen = ref(false)
const isSearching = ref(false)
const isSaving = ref(false)

const form = ref({
  nombre: '',
  telefono: ''
})

const userQuery = ref('')
const usuarios = ref<Usuario[]>([])
const selectedUsuario = ref<Usuario | null>(null)

const canSave = computed(() => {
  return !!selectedUsuario.value && form.value.nombre.trim().length > 0
})

const filteredSearchResults = computed(() => usuarios.value)

async function loadBufetes() {
  loading.value = true
  try {
    const { data } = await api.get<Bufete[]>('/bufetes')
    bufetes.value = data
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  isCreateOpen.value = true
  usuarios.value = []
  userQuery.value = ''
  selectedUsuario.value = null
  form.value = { nombre: '', telefono: '' }
}

function closeCreateModal() {
  isCreateOpen.value = false
}

const isUserAlreadyAssigned = (userId: number) => {
    return bufetes.value.some(b => b.usuario_id === userId)
}

async function searchUsuarios() {
  const q = userQuery.value.trim()
  if (!q) return

  try {
    isSearching.value = true
    const { data } = await api.get<Usuario[]>('/usuarios/search', { params: { name: q } })
    usuarios.value = data
  } catch (e: any) {
    console.error('Error searching users:', e)
  } finally {
    isSearching.value = false
  }
}

function selectUsuario(u: Usuario) {
  if (isUserAlreadyAssigned(u.id)) return
  selectedUsuario.value = u
  form.value.nombre = (u.name || u.username || '').toString().trim()
  form.value.telefono = (u.telefono || '').toString().trim()
}

let debounceTimer: number | null = null
function debouncedSearch() {
  if (debounceTimer) window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    if (userQuery.value.trim().length >= 2) searchUsuarios()
  }, 350)
}

async function createBufete() {
  if (!canSave.value || !selectedUsuario.value) return
  try {
    isSaving.value = true
    const payload = {
      usuario_id: selectedUsuario.value.id
    }
    await api.post('/bufetes', payload)
    
    await Swal.fire({ 
        icon: 'success', 
        title: 'Registro Exitoso', 
        text: 'El bufete ha sido vinculado correctamente al sistema.',
        customClass: {
            container: 'font-bold'
        }
    })
    closeCreateModal()
    await loadBufetes()
  } catch (e: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Validación del Sistema',
      text: e?.response?.data?.detail || 'No se pudo completar el registro del bufete.'
    })
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await loadBufetes()
})
</script>

<style scoped>
@reference "@/assets/main.css";

.modal-enter-active, .modal-leave-active { transition: opacity 0.4s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
