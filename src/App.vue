<script>
// --- IMPORTACIONES ---
// Importamos los componentes que hemos creado para poder usarlos en el template.
import AppHeader from './components/AppHeader.vue';
import LoginScreen from './components/LoginScreen.vue';
import Dashboard from './components/Dashboard.vue';
import CreatePostPanel from './components/CreatePostPanel.vue';

// Importamos las funciones que hacen llamadas a APIs externas.
// Esto mantiene nuestro componente más limpio, separando responsabilidades.
import * as api from './services/api';

// --- DEFINICIÓN DEL COMPONENTE PRINCIPAL (APP) ---
export default {
  // components: registra los componentes importados para que Vue los reconozca en el <template>.
  components: {
    AppHeader,
    LoginScreen,
    Dashboard,
    CreatePostPanel
  },

  // data(): aquí se define el "estado" de la aplicación. Son todas las variables reactivas.
  data() {
    return {
      // --- ESTADO DE LA APLICACIÓN ---
      isLoggedIn: false, // Controla si el usuario ha iniciado sesión.
      username: '',      // Guarda el nombre del usuario.

      // --- POSTS Y DATOS ---
      posts: [], // Array que contendrá todos los posts creados.

      // --- MODAL Y FORMULARIO ---
      showModal: false, // Controla la visibilidad del panel lateral para crear posts.

      // --- APIS EXTERNAS ---
      weather: null,            // Guardará los datos del clima.
      inspirationQuote: null, // Guardará la frase inspiracional.

      // --- CONFIGURACIÓN ---
      appConfig: {
        name: 'Proyecto Tarjetas',
        logo: 'PT',
        welcomeTitle: 'Bienvenido al Proyecto de Tarjetas',
        welcomeSubtitle: 'Proyecto del 2Q Con Vue.js',
      }
    }
  },

  // --- MÉTODOS ---
  // methods: contiene todas las funciones que puede ejecutar este componente.
  methods: {
    // --- AUTENTICACIÓN ---
    async handleLogin(username) {
      // Este método se activa cuando el componente LoginScreen emite el evento "login".
      if (!username.trim()) {
        this.showNotification('Por favor ingresa tu nombre', 'warning');
        return;
      }

      this.isLoggedIn = true;
      this.username = username;
      this.showNotification(`¡Bienvenido ${this.username}! 🎉`, 'success');
      this.saveToStorage(); // Guardamos el estado en el LocalStorage.
      await this.loadAPIsData(); // Cargamos los datos de las APIs externas.
    },

    handleLogout() {
      // Se activa cuando AppHeader emite el evento "logout".
      this.isLoggedIn = false;
      this.username = '';
      this.posts = []; // Limpiamos los posts al salir.
      this.showNotification('¡Hasta luego! 👋', 'info');
      this.saveToStorage();
    },

    // --- GESTIÓN DE POSTS ---
    //openCreateModal() {
      // Abre el panel lateral.
      //this.showModal = true;
    //},
    openCreateModal() {
      console.log('¡Evento recibido! Intentando abrir el modal...'); // <-- AÑADE ESTA LÍNEA
      this.showModal = true;
    },

    closeModal() {
      // Cierra el panel lateral.
      this.showModal = false;
    },

    handleCreatePost(newPostData) {
      // Se activa cuando el panel CreatePostPanel emite el evento "create-post".
      const post = {
        id: Date.now(),
        ...newPostData, // Usamos los datos recibidos del componente hijo.
        liked: false,
        createdAt: new Date().toLocaleDateString('es-ES', {
          year: 'numeric', month: 'long', day: 'numeric'
        }),
        author: this.username
      };

      this.posts.unshift(post); // Agrega el nuevo post al inicio del array.
      this.closeModal();
      this.showNotification('¡Post creado exitosamente! ✨', 'success');
      this.saveToStorage();
    },

    handleDeletePost(postId) {
      // Se activa cuando Dashboard (que a su vez escucha a PostCard) emite "delete-post".
      if (confirm('¿Estás seguro de eliminar este post?')) {
        this.posts = this.posts.filter(p => p.id !== postId);
        this.showNotification('Post eliminado', 'info');
        this.saveToStorage();
      }
    },

    handleToggleLike(postId) {
      // Se activa cuando Dashboard (que a su vez escucha a PostCard) emite "toggle-like".
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.liked = !post.liked;
        this.saveToStorage();

        // Efecto visual (opcional, pero mejora la experiencia).
        const button = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
        if (button) {
          button.style.animation = 'pulse 0.3s ease';
          setTimeout(() => { button.style.animation = ''; }, 300);
        }
      }
    },

    // --- APIS EXTERNAS ---
    async loadAPIsData() {
      // Carga los datos de las APIs en paralelo para mayor eficiencia.
      // Usamos las funciones importadas desde 'services/api.js'.
      const [weatherResult, quoteResult] = await Promise.allSettled([
        api.loadWeather(),
        api.loadInspirationalQuote()
      ]);

      if (weatherResult.status === 'fulfilled') {
        this.weather = weatherResult.value;
      }
      if (quoteResult.status === 'fulfilled') {
        this.inspirationQuote = quoteResult.value;
      }
    },

    // --- UTILIDADES (LocalStorage y Notificaciones) ---
    saveToStorage() {
      // Guarda los datos importantes en el almacenamiento local del navegador.
      const data = {
        posts: this.posts,
        username: this.username,
        isLoggedIn: this.isLoggedIn
      };
      localStorage.setItem('postsHub_data', JSON.stringify(data));
    },

    loadFromStorage() {
      // Carga los datos desde el almacenamiento local al iniciar la app.
      const data = localStorage.getItem('postsHub_data');
      if (data) {
        const parsed = JSON.parse(data);
        this.posts = parsed.posts || [];
        this.username = parsed.username || '';
        this.isLoggedIn = parsed.isLoggedIn || false;
      }
    },

    showNotification(message, type = 'info') {
      // Crea una notificación en el DOM de forma dinámica.
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `<span>${message}</span>`;
      document.body.appendChild(notification);

      setTimeout(() => notification.classList.add('show'), 10);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 400);
      }, 3000);
    },
  },

  // --- LIFECYCLE HOOKS ---
  // mounted(): se ejecuta una sola vez, cuando el componente ha sido montado en el DOM.
  // Es el lugar ideal para cargar datos iniciales.
  async mounted() {
    this.loadFromStorage();

    if (this.isLoggedIn) {
      await this.loadAPIsData();
    }

    // Escucha la tecla 'Escape' para cerrar el modal.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showModal) {
        this.closeModal();
      }
    });
  }
}
</script>

<template>
  <div class="app">
    <AppHeader
        :is-logged-in="isLoggedIn"
        :weather="weather"
        :app-config="appConfig"
        @logout="handleLogout"
    />

    <main class="app-container">
      <LoginScreen
          v-if="!isLoggedIn"
          :app-config="appConfig"
          @login="handleLogin"
      />

      <Dashboard
          v-else
          :username="username"
          :posts="posts"
          :inspiration-quote="inspirationQuote"
          @open-create-modal="openCreateModal"
          @toggle-like="handleToggleLike"
          @delete-post="handleDeletePost"
      />
    </main>

    <CreatePostPanel
        :show="showModal"
        @close="closeModal"
        @create-post="handleCreatePost"
    />
  </div>
</template>

<style>
/* Los estilos en App.vue deberían ser mínimos o específicos para el layout de App.vue.
  La mayoría de los estilos ya están en src/assets/main.css.
  Si añades la palabra 'scoped' (<style scoped>), los estilos de aquí SOLO se aplicarán
  a este componente App.vue, evitando conflictos con los componentes hijos.
*/
</style>