<script>
export default {
  // Este componente es "tonto". Solo recibe un post y lo muestra.
  // No tiene lógica de negocio, solo de presentación.
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  // Declara los eventos que puede emitir.
  emits: ['toggle-like', 'delete-post'],
  methods: {
    // Métodos para determinar la clase CSS de la galería de imágenes.
    getImageGridClass(imageCount) {
      if (imageCount === 1) return 'single-image';
      if (imageCount === 2) return 'two-images';
      return 'multiple-images';
    }
  }
}
</script>

<template>
  <article class="post-card" :data-post-id="post.id">
    <header class="post-header">
      <h3 class="post-title">{{ post.title }}</h3>
      <div class="post-meta">
        <span><i class="far fa-calendar"></i> {{ post.createdAt }}</span>
        <span><i class="far fa-user"></i> {{ post.author }}</span>
      </div>
    </header>

    <div class="post-content">
      <p class="post-description">{{ post.description }}</p>

      <div
          v-if="post.images && post.images.length > 0"
          :class="['post-gallery', getImageGridClass(post.images.length)]"
      >
        <img
            v-for="image in post.images.slice(0, 4)"
            :key="image.id"
            :src="image.url"
            :alt="image.name"
            class="post-image"
        >
      </div>
    </div>

    <footer class="post-actions">
      <div class="action-buttons">
        <button @click="$emit('toggle-like', post.id)" :class="['action-btn', 'like-btn', { liked: post.liked }]">
          <i :class="post.liked ? 'fas fa-heart' : 'far fa-heart'"></i>
          <span>{{ post.liked ? 'Liked' : 'Like' }}</span>
        </button>
      </div>
      <button @click="$emit('delete-post', post.id)" class="action-btn" style="color: var(--danger-color);">
        <i class="far fa-trash-alt"></i>
      </button>
    </footer>
  </article>
</template>

<style scoped>
/* Estilos que solo se aplican a las tarjetas de post. */
.post-actions {
  /* Asegura que las acciones siempre estén al final de la tarjeta */
  margin-top: auto;
}
</style>
