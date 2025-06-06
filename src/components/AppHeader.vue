<script>
export default {
  // --- PROPS ---
  // Las props son datos que este componente recibe de su componente padre (App.vue).
  // Es la forma de comunicar datos "hacia abajo".
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true // Indica que esta prop es obligatoria.
    },
    weather: {
      type: Object,
      default: null // Si no se pasa, su valor será null.
    },
    appConfig: {
      type: Object,
      required: true
    }
  },

  // --- EMITS ---
  // Los emits declaran los eventos personalizados que este componente puede "emitir"
  // hacia su componente padre. Es la forma de comunicar acciones "hacia arriba".
  emits: ['logout'],

  methods: {
    // Este método se llama cuando se hace clic en el botón de salir.
    // Emite el evento 'logout' para que el padre (App.vue) pueda escucharlo y reaccionar.
    handleLogout() {
      this.$emit('logout');
    }
  }
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo">{{ appConfig.logo }}</div>
        <h1 class="app-title">{{ appConfig.name }}</h1>
      </div>

      <div class="user-controls" v-if="isLoggedIn">
        <div v-if="weather" class="weather-widget">
          <i class="fas fa-thermometer-half"></i>
          {{ weather.temperature }}°C
        </div>

        <button @click="handleLogout" class="btn btn-danger">
          <i class="fas fa-sign-out-alt"></i>
          Salir
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/*
  La palabra 'scoped' aquí es muy importante. Significa que cualquier estilo
  que escribas aquí SOLO se aplicará a este componente (AppHeader.vue) y no
  afectará a ninguna otra parte de la aplicación.
*/
</style>