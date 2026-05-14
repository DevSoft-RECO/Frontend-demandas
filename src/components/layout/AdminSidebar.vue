<template>
  <div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
    <nav 
      ref="dockRef"
      class="pointer-events-auto flex items-center gap-1 p-2 
             bg-azul-cope dark:bg-slate-900
             rounded-[1.8rem] border border-white/10
             shadow-[0_20px_50px_rgba(0,0,0,0.4)]
             transition-all duration-500"
    >
      <template v-for="item in menuItems" :key="item.id">
        <!-- Item Simple -->
        <div v-if="!item.children" class="relative group">
            <RouterLink
            :to="item.route"
            @click="handleItemClick"
            class="flex flex-col items-center p-2 rounded-[1.4rem] transition-all duration-300 relative"
            :class="[
                isActive(item.route)
                ? 'bg-white/15 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            ]"
            >
                <div class="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1.5">
                    <svg v-html="item.iconSvg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></svg>
                </div>
                
                <!-- Indicador Activo -->
                <div v-if="isActive(item.route)" class="absolute -bottom-0.5 w-1 h-1 bg-verde-cope rounded-full shadow-[0_0_8px_#5aba03]"></div>
            </RouterLink>

            <!-- Tooltip -->
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1 bg-azul-cope text-white text-[9px] font-black rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap uppercase tracking-widest border border-white/10 shadow-xl">
                {{ item.label }}
            </div>
        </div>

        <!-- Item con Submenú -->
        <div v-else class="relative group">
            <button
                @click="toggleGroup(item.id)"
                class="flex flex-col items-center p-2 rounded-[1.4rem] transition-all duration-300 relative"
                :class="[
                    openGroups.includes(item.id)
                    ? 'bg-white/15 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                ]"
            >
                <div class="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1.5">
                    <svg v-html="item.iconSvg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"></svg>
                </div>
                <!-- Indicador de que tiene submenú -->
                <div class="absolute -bottom-0.5 w-1 h-1 bg-white/20 rounded-full"></div>
            </button>

            <!-- Pop-over Submenu (Opens Upward) -->
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0 translate-y-2"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 translate-y-2"
            >
                <div 
                    v-if="openGroups.includes(item.id)"
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 
                           bg-azul-cope border border-white/10 rounded-2xl shadow-2xl p-2 z-[60]"
                >
                    <div class="px-3 py-2 mb-1 border-b border-white/5 text-[9px] font-black text-verde-cope uppercase tracking-widest">
                        {{ item.label }}
                    </div>
                    <RouterLink
                        v-for="child in item.children"
                        :key="child.route"
                        :to="child.route"
                        @click="handleItemClick"
                        class="flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        :class="{ 'bg-white/5 text-white': isActive(child.route) }"
                    >
                        <span class="w-1.5 h-1.5 rounded-full" :class="isActive(child.route) ? 'bg-verde-cope' : 'bg-white/20'"></span>
                        {{ child.label }}
                    </RouterLink>
                </div>
            </Transition>
        </div>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const openGroups = ref<string[]>([])
const dockRef = ref<HTMLElement | null>(null)

const handleItemClick = () => {
  openGroups.value = [] // Cerrar todo al navegar
}

const toggleGroup = (id: string) => {
  const index = openGroups.value.indexOf(id)
  if (index === -1) {
    openGroups.value = [id] // Solo uno abierto a la vez (estilo MacOS)
  } else {
    openGroups.value.splice(index, 1)
  }
}

// Lógica de Click Outside
const handleClickOutside = (event: MouseEvent) => {
    if (dockRef.value && !dockRef.value.contains(event.target as Node)) {
        openGroups.value = []
    }
}

onMounted(() => {
    window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside)
})

const isActive = (path: string) => route.path === path

const menuItems = computed(() => {
    const items = [
        {
            id: 'home',
            label: 'Dashboard',
            route: '/admin/dashboard',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2 7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2v10a1 1 0 01-1 1h-3m-4 0h4" />',
        },
        {
            id: 'ajustes',
            label: 'Ajustes',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />',
            children: [
                { label: 'Bufetes', route: '/admin/ajustes/bufetes' },
                { label: 'Presets', route: '/admin/ajustes/presets' }
            ]
        },
        {
            id: 'demandas',
            label: 'Demandas',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />',
            children: [
                { label: 'Gestión de Demandas', route: '/admin/demandas/lista' },
                { label: 'Gestión de Pagos', route: '/admin/finanzas/pagos' },
                { label: 'Supervisar Seguimiento', route: '/admin/supervision-legal' }
            ]
        },
        {
            id: 'abogados',
            label: 'Abogados',
            iconSvg: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />',
            children: [
                { label: 'Seguimiento Legal', route: '/admin/abogado/seguimiento' },
            ]
        }
    ]

    // Filtrar por permisos
    return items.filter(item => {
        if (item.id === 'ajustes') {
            return authStore.hasRole('Super Admin') || authStore.hasPermission('acceso_total')
        }
        return true
    })
})
</script>

<style scoped>
@reference "@/assets/main.css";
</style>
