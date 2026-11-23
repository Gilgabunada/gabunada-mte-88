<script setup>
import { onMounted, ref } from "vue";
import { apiRequest } from "../api.js";
import { notifyError } from "../notify.js";
import MovieCard from "../components/MovieCard.vue";

const movies = ref([]);
const errorMsg = ref("");
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await apiRequest("/movies/getMovies");
    movies.value = Array.isArray(data) ? data : data.movies || [];
  } catch (err) {
    errorMsg.value = err.message;
    notifyError(err.message);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section>
    <h2>Movies Catalog</h2>
    <p v-if="loading">Loading movies...</p>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    <p v-else-if="!loading && movies.length === 0">No movies available yet.</p>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
      <MovieCard v-for="movie in movies" :key="movie._id || movie.id" :movie="movie" />
    </div>
  </section>
</template>