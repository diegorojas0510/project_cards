<script>
export default {
  props: {
    show: Boolean // La única prop que necesita es saber si debe mostrarse o no.
  },
  // Declaramos los eventos que puede emitir.
  emits: ['close', 'create-post'],
  data() {
    return {
      // El estado del formulario vive dentro de este componente, como antes.
      newPost: {
        title: '',
        description: '',
        images: []
      },
      isDragging: false
    }
  },
  methods: {
    // Este método se llama cuando el formulario se envía.
    handleCreatePost() {
      if (!this.newPost.title.trim() || !this.newPost.description.trim()) {
        alert('El título y la descripción son obligatorios');
        return;
      }
      // Emite el evento con los datos del post.
      this.$emit('create-post', { ...this.newPost });
      this.resetForm();
    },
    // Este método se llama para cerrar el panel.
    closePanel() {
      this.$emit('close');
    },
    resetForm() {
      this.newPost = { title: '', description: '', images: [] };
    },
    // Los métodos para manejar imágenes se quedan igual.
    handleImageUpload(event) {
      this.processImages(Array.from(event.target.files));
    },
    handleDrop(event) {
      event.preventDefault(); this.isDragging = false;
      this.processImages(Array.from(event.dataTransfer.files));
    },
    processImages(files) {
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newPost.images.push({ id: Date.now() + Math.random(), url: e.target.result, name: file.name });
        };
        reader.readAsDataURL(file);
      });
    },
    removeImage(imageId) {
      this.newPost.images = this.newPost.images.filter(img => img.id !== imageId);
    }
  }
}
</script>

<template>
  <div class="modal-overlay" :class="{ 'show': show }" @click="closePanel">
    <aside class="side-panel" :class="{ 'show': show }" @click.stop>

      <header class="panel-header">
        <h2 class="panel-title">Crear Nuevo Post</h2>
      </header>
      <div class="panel-content">
        <form @submit.prevent="handleCreatePost">
          <div class="form-group">
            <label class="form-label">Título del Post</label>
            <input type="text" v-model="newPost.title" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Descripción</label>
            <textarea v-model="newPost.description" class="form-textarea" required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Imágenes</label>
            <div
                class="image-upload-area"
                :class="{ 'dragover': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop="handleDrop"
                @click="$refs.fileInput.click()"
            >
              <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
            </div>
            <input ref="fileInput" type="file" multiple accept="image/*" @change="handleImageUpload" style="display: none;">
            <div v-if="newPost.images.length > 0" class="uploaded-images">
              <div v-for="image in newPost.images" :key="image.id" class="uploaded-image">
                <img :src="image.url" :alt="image.name">
                <button type="button" @click="removeImage(image.id)" class="remove-image">&times;</button>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button type="button" @click="closePanel" class="btn">Cancelar</button>
            <button type="submit" class="btn btn-primary">Crear Post</button>
          </div>
        </form>
      </div>
    </aside>
  </div>
</template>