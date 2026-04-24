<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Bufetes</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Administra el portafolio de bufetes y asigna abogados (usuarios).
        </p>
      </div>

      <button
        class="inline-flex items-center gap-2 rounded-xl bg-verde-cope px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-verde-cope/20 hover:brightness-110 active:brightness-95 transition"
        @click="openCreateModal"
      >
        Agregar nuevo
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="b in bufetes"
        :key="b.id"
        class="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm hover:shadow-md transition
               dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-lg font-extrabold text-gray-900 dark:text-white truncate">
              {{ b.nombre || '—' }}
            </div>
            <div class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Tel: {{ b.telefono || '—' }}
            </div>
          </div>

          <div class="shrink-0 rounded-full bg-azul-cope/10 px-3 py-1 text-xs font-bold text-azul-cope dark:bg-white/10 dark:text-white">
            Usuario #{{ b.usuario_id ?? '—' }}
          </div>
        </div>

        <div class="mt-4">
          <div class="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Abogado asignado
          </div>

          <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Este registro guarda el nombre y teléfono copiados desde `usuarios`.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Bufete -->
    <div v-if="isCreateOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCreateModal"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800">
          <div class="flex items-start justify-between gap-4 p-5 border-b border-gray-200/60 dark:border-gray-800">
            <div>
              <div class="text-lg font-extrabold text-gray-900 dark:text-white">Nuevo bufete</div>
              <div class="text-sm text-gray-600 dark:text-gray-300">Busca un usuario por nombre y asígnalo.</div>
            </div>
            <button class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" @click="closeCreateModal">
              Cerrar
            </button>
          </div>

          <div class="p-5 space-y-5">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-xs font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  v-model="form.nombre"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-verde-cope/20 disabled:opacity-70
                         dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="Ej. Bufete López & Asociados"
                  :disabled="!!selectedUsuario"
                />
              </div>

              <div>
                <label class="block text-xs font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  v-model="form.telefono"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-verde-cope/20 disabled:opacity-70
                         dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="Ej. 5512-3456"
                  :disabled="!!selectedUsuario"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
                Buscar usuario por nombre
              </label>

              <div class="flex gap-2">
                <input
                  v-model="userQuery"
                  type="text"
                  class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-azul-cope/15
                         dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder="Escribe parte del nombre..."
                  @input="debouncedSearch()"
                />
                <button
                  class="rounded-xl bg-azul-cope px-4 py-2.5 text-sm font-bold text-white hover:brightness-110 active:brightness-95 transition disabled:opacity-60"
                  :disabled="isSearching || userQuery.trim().length === 0"
                  @click="searchUsuarios"
                >
                  Buscar
                </button>
              </div>

              <div v-if="isSearching" class="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Buscando...
              </div>

              <div v-if="usuarios.length > 0" class="mt-3 max-h-56 overflow-auto rounded-xl border border-gray-200 dark:border-gray-800">
                <button
                  v-for="u in usuarios"
                  :key="u.id"
                  class="w-full text-left px-4 py-3 border-b border-gray-200/60 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
                  @click="selectUsuario(u)"
                >
                  <div class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ u.name || u.username || u.email || ('Usuario #' + u.id) }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-300">
                    {{ u.email || '—' }} · #{{ u.id }}
                  </div>
                </button>
              </div>

              <div v-if="selectedUsuario" class="mt-4 rounded-2xl bg-verde-cope/10 border border-verde-cope/30 p-4">
                <div class="text-xs font-extrabold uppercase tracking-wider text-verde-cope">Usuario seleccionado</div>
                <div class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                  {{ selectedUsuario.name || selectedUsuario.username || selectedUsuario.email || ('Usuario #' + selectedUsuario.id) }}
                </div>
                <div class="text-xs text-gray-700 dark:text-gray-300">
                  {{ selectedUsuario.email || '—' }} · #{{ selectedUsuario.id }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 p-5 border-t border-gray-200/60 dark:border-gray-800">
            <button
              class="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
              @click="closeCreateModal"
            >
              Cancelar
            </button>
            <button
              class="rounded-xl bg-verde-cope px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-verde-cope/20 hover:brightness-110 active:brightness-95 transition disabled:opacity-60"
              :disabled="isSaving || !canSave"
              @click="createBufete"
            >
              {{ isSaving ? 'Guardando...' : 'Crear bufete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api/axios'

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
  return !!selectedUsuario.value
})

async function loadBufetes() {
  const { data } = await api.get<Bufete[]>('/bufetes')
  bufetes.value = data
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

async function searchUsuarios() {
  const q = userQuery.value.trim()
  if (!q) return

  try {
    isSearching.value = true
    const { data } = await api.get<Usuario[]>('/usuarios/search', { params: { name: q } })
    usuarios.value = data
  } catch (e: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: e?.response?.data?.detail || 'No se pudo buscar usuarios'
    })
  } finally {
    isSearching.value = false
  }
}

function selectUsuario(u: Usuario) {
  selectedUsuario.value = u

  // Precargar datos básicos desde `usuarios`
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
    await Swal.fire({ icon: 'success', title: 'Listo', text: 'Bufete creado correctamente' })
    closeCreateModal()
    await loadBufetes()
  } catch (e: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: e?.response?.data?.detail || 'No se pudo crear el bufete'
    })
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await loadBufetes()
})
</script>

