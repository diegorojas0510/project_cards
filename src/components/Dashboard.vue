<script>
import PostCard from './PostCard.vue';

// ¡Hemos eliminado Masonry, ref, nextTick, setup, mounted y watch!
// El componente vuelve a ser muy simple.

export default {
  components: {
    PostCard
  },
  props: {
    username: String,
    posts: Array,
    inspirationQuote: Object,
  },
  emits: ['open-create-modal', 'toggle-like', 'delete-post'],
  data() {
    return {
      searchQuery: '',
      activeFilter: 'all',
    }
  },
  computed: {
    filteredPosts() {
      let filtered = this.posts;
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query)
        );
      }
      if (this.activeFilter !== 'all') {
        if (this.activeFilter === 'liked') {
          filtered = filtered.filter(post => post.liked);
        } else if (this.activeFilter === 'with-images') {
          filtered = filtered.filter(post => post.images && post.images.length > 0);
        }
      }
      return filtered;
    },
    totalPosts() { return this.posts.length; },
    likedPosts() { return this.posts.filter(p => p.liked).length; },
    postsWithImages() { return this.posts.filter(p => p.images && p.images.length > 0).length; }
  },
  methods: {
    setFilter(filter) {
      this.activeFilter = filter;
    },
    emitToggleLike(postId) {
      this.$emit('toggle-like', postId);
    },
    emitDeletePost(postId) {
      this.$emit('delete-post', postId);
    }
  }
}
</script>

<template>
  <div>
    <div class="welcome-section">
      <h2 class="welcome-title">¡Hola, {{ username }}! 👋</h2>
      <p class="welcome-subtitle">
        Tienes {{ totalPosts }} posts, {{ likedPosts }} favoritos
      </p>
      <div v-if="inspirationQuote" class="inspiration-quote">
        <p style="font-size: 1.1rem; font-style: italic; margin-bottom: 0.5rem;">
          "{{ inspirationQuote.text }}"
        </p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">
          — {{ inspirationQuote.author }}
        </p>
      </div>
      <button @click="$emit('open-create-modal')" class="btn btn-success">
        <i class="fas fa-plus"></i>
        Crear Nuevo Post
      </button>
    </div>
    <div class="search-section">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input type="text" v-model="searchQuery" class="search-input" placeholder="Buscar posts...">
      </div>
    </div>
    <div class="filters-section">
      <button @click="setFilter('all')" :class="['filter-btn', { active: activeFilter === 'all' }]">Todos ({{ totalPosts }})</button>
      <button @click="setFilter('liked')" :class="['filter-btn', { active: activeFilter === 'liked' }]">Favoritos ({{ likedPosts }})</button>
      <button @click="setFilter('with-images')" :class="['filter-btn', { active: activeFilter === 'with-images' }]">Con Imágenes ({{ postsWithImages }})</button>
    </div>

    <div v-if="filteredPosts.length > 0" class="posts-grid">
      <PostCard
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          @toggle-like="emitToggleLike"
          @delete-post="emitDeletePost"
      />
    </div>

    <div v-else class="empty-state">
      <i class="fas fa-inbox empty-icon"></i>
      <h3 class="empty-title">No hay posts que mostrar</h3>
      <p>{{ searchQuery ? 'No se encontraron posts con esa búsqueda' : 'Crea tu primer post para comenzar' }}</p>
    </div>
  </div>
</template>

<style scoped>
/* El CSS scoped se queda igual */
.search-section {
  max-width: 100%;
  margin-bottom: 1rem;
  padding: 0 1rem;
}
.filters-section {
  justify-content: center;
  padding: 0 1rem;
}
</style>