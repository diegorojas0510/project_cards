<script>
export default {
  // Este componente también recibe la configuración de la app como prop.
  props: {
    appConfig: {
      type: Object,
      required: true
    }
  },

  // Declara el evento 'login' que emitirá.
  emits: ['login'],

  // Tiene su propio estado local para el campo de texto del nombre de usuario.
  data() {
    return {
      username: ''
    }
  },

  methods: {
    // Cuando se intenta iniciar sesión...
    submitLogin() {
      // ...emite el evento 'login' y pasa el valor del username como dato.
      // El componente padre (App.vue) estará escuchando este evento.
      this.$emit('login', this.username);
    }
  }
}
</script>

<template>
  <div class="login-container">
    <div class="welcome-section">
      <h2 class="welcome-title">{{ appConfig.welcomeTitle }}</h2>
      <p class="welcome-subtitle">{{ appConfig.welcomeSubtitle }}</p>
    </div>

    <div class="form-group">
      <label class="form-label">Nombre de usuario</label>
      <input
          type="text"
          v-model="username"
          class="form-input"
          placeholder="Ingresa tu nombre"
          @keyup.enter="submitLogin"
      >
    </div>

    <button @click="submitLogin" class="btn btn-primary" style="width: 100%;">
      <i class="fas fa-sign-in-alt"></i>
      Iniciar Sesión
    </button>
  </div>
</template>

<style scoped>
/* Estilos que solo aplican a la pantalla de login */
</style>