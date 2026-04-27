<template>
  <header
    class="fixed top-4 left-6 right-6 z-50 flex h-[60px] items-center justify-between px-6
           bg-azul-cope dark:bg-slate-900 
           rounded-2xl border-b-2 border-verde-cope
           shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
  >
    <!-- Left: Brand & Context -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 group cursor-pointer">
        <div class="p-1.5 bg-white/10 rounded-lg group-hover:bg-verde-cope transition-colors duration-300">
            <img src="@/assets/yk.png" alt="YK" class="h-5 w-5 brightness-0 invert" />
        </div>
        <span class="text-[12px] font-black text-white uppercase tracking-widest hidden sm:block">Yamankutx</span>
      </div>
      
      <div class="h-6 w-[1px] bg-white/10 mx-1"></div>
      
      <div class="flex flex-col">
          <span class="text-[8px] font-black text-verde-cope uppercase tracking-[0.2em] leading-none mb-1">Módulo Actual</span>
          <h1 class="text-[11px] font-bold text-white uppercase tracking-tight">
              {{ routeTitle }}
          </h1>
      </div>
    </div>

    <!-- Center: Date Widget -->
    <div class="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-black/20 rounded-full border border-white/5">
        <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">{{ currentDate }}</span>
        <div class="w-1.5 h-1.5 rounded-full bg-verde-cope animate-pulse shadow-[0_0_8px_#5aba03]"></div>
    </div>

    <!-- Right: System Actions -->
    <div class="flex items-center gap-4">
      
      <!-- Theme Selector -->
      <button
        @click="layoutStore.toggleTheme"
        class="p-2 rounded-xl text-white/70 hover:text-verde-cope hover:bg-white/5 transition-all"
        title="Cambiar Tema"
      >
        <svg v-if="layoutStore.isDark" class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <!-- User Info -->
      <div class="relative group">
        <button
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-verde-cope transition-all"
        >
          <div class="h-8 w-8 rounded-lg bg-verde-cope flex items-center justify-center text-azul-cope font-black text-[10px]">
            {{ userInitials }}
          </div>
          <div class="hidden md:block text-left">
            <p class="text-[10px] font-black text-white leading-none uppercase">{{ userName }}</p>
            <p class="text-[8px] font-bold text-verde-cope uppercase mt-1 tracking-tighter">En Línea</p>
          </div>
          <svg class="w-3 h-3 text-white/30 group-hover:text-verde-cope transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0 translate-y-1"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 translate-y-1"
        >
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-azul-cope border border-white/10 shadow-2xl p-2 z-[60]"
          >
            <div class="px-4 py-3 bg-black/20 rounded-xl mb-2">
                <p class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Cuenta Activa</p>
                <p class="text-[11px] font-bold text-white truncate">{{ userEmail }}</p>
            </div>
            <button
              @click="handleReturn"
              class="flex w-full items-center gap-3 px-4 py-2.5 text-[11px] font-black text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
              Regresar al Portal
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()

const isUserMenuOpen = ref(false)

const userName = computed(() => authStore.user?.name || 'Admin')
const userEmail = computed(() => authStore.user?.email || 'admin@cooperativa.com')

const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
})

const routeTitle = computed(() => {
  return (route.meta.title as string) || 'Dashboard'
})

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('es-ES', { 
    weekday: 'short',
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())
})

const handleReturn = () => {
  isUserMenuOpen.value = false
  authStore.logoutLocal()
  window.location.href = import.meta.env.VITE_MOTHER_APP_URL || 'http://localhost:5173'
}
</script>
