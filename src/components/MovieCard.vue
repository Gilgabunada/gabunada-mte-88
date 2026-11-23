<script setup>
import { RouterLink } from "vue-router";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article>
    <div>
      <h3>{{ movie.title }}</h3>
      <p><strong>Director:</strong> {{ movie.director }}</p>
      <p><strong>Year:</strong> {{ movie.year }}</p>
      <p><strong>Genre:</strong> {{ movie.genre }}</p>
      <p>{{ movie.description }}</p>
      <p><strong>Comments:</strong> {{ Array.isArray(movie.comments) ? movie.comments.length : 0 }}</p>
    </div>
    <RouterLink :to="`/movies/${movie._id || movie.id}`">View Movie</RouterLink>
  </article>
</template>