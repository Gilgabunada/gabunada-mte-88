<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { apiRequest } from "../api.js";
import { authState } from "../stores/auth.js";
import { notifySuccess, notifyError } from "../notify.js";

const route = useRoute();
const movieId = route.params.id;

const movie = ref(null);
const comments = ref([]);
const newComment = ref("");
const errorMsg = ref("");
const submitting = ref(false);

async function loadMovieAndComments() {
  errorMsg.value = "";
  const movieData = await apiRequest(`/movies/getMovie/${movieId}`);
  movie.value = movieData.movie || movieData;

  try {
    const commentData = await apiRequest(`/movies/getComments/${movieId}`);
    comments.value = Array.isArray(commentData)
      ? commentData
      : commentData.comments || movie.value?.comments || [];
  } catch {
    comments.value = Array.isArray(movie.value?.comments) ? movie.value.comments : [];
  }
}

async function handleAddComment() {
  if (!newComment.value.trim()) return;
  errorMsg.value = "";
  submitting.value = true;

  try {
    await apiRequest(`/movies/addComment/${movieId}`, {
      method: "PATCH",
      token: authState.token,
      body: {
        comment: newComment.value.trim(),
      },
    });
    newComment.value = "";
    notifySuccess("Comment added!");
    await loadMovieAndComments();
  } catch (err) {
    errorMsg.value = err.message;
    notifyError(err.message);
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  try {
    await loadMovieAndComments();
  } catch (err) {
    errorMsg.value = err.message;
    notifyError(err.message);
  }
});
</script>

<template>
  <section style="max-width: 720px;">
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    <div v-if="movie">
      <h2>{{ movie.title }}</h2>
      <p><strong>Director:</strong> {{ movie.director }}</p>
      <p><strong>Year:</strong> {{ movie.year }}</p>
      <p><strong>Genre:</strong> {{ movie.genre }}</p>
      <p><strong>Description:</strong> {{ movie.description }}</p>

      <hr />
      <h3>Comments</h3>
      <form @submit.prevent="handleAddComment" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
        <input v-model="newComment" type="text" placeholder="Write a comment..." required />
        <button id="addComment" type="submit" :disabled="submitting">
          {{ submitting ? "Posting..." : "Add Comment" }}
        </button>
      </form>

      <ul>
        <li v-for="(c, idx) in comments" :key="c._id || c.id || idx">
          {{ typeof c === "string" ? c : c.comment || c.text || JSON.stringify(c) }}
        </li>
      </ul>
    </div>
  </section>
</template>