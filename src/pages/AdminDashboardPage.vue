<script setup>
import { onMounted, ref } from "vue";
import { apiRequest } from "../api.js";
import { authState } from "../stores/auth.js";
import { notifySuccess, notifyError } from "../notify.js";

const movies = ref([]);
const errorMsg = ref("");
const editingId = ref(null);

const form = ref({
  title: "",
  director: "",
  year: "",
  genre: "",
  description: "",
});

async function fetchMovies() {
  const data = await apiRequest("/movies/getMovies");
  movies.value = Array.isArray(data) ? data : data.movies || [];
}

function resetForm() {
  editingId.value = null;
  form.value = { title: "", director: "", year: "", genre: "", description: "" };
}

function startEdit(movie) {
  editingId.value = movie._id || movie.id;
  form.value = {
    title: movie.title || "",
    director: movie.director || "",
    year: movie.year || "",
    genre: movie.genre || "",
    description: movie.description || "",
  };
}

async function handleSubmitMovie() {
  errorMsg.value = "";
  try {
    if (editingId.value) {
      await apiRequest(`/movies/updateMovie/${editingId.value}`, {
        method: "PATCH",
        token: authState.token,
        body: { ...form.value, year: Number(form.value.year) },
      });
      notifySuccess("Movie updated!");
    } else {
      await apiRequest("/movies/addMovie", {
        method: "POST",
        token: authState.token,
        body: { ...form.value, year: Number(form.value.year) },
      });
      notifySuccess("Movie added!");
    }
    resetForm();
    await fetchMovies();
  } catch (err) {
    errorMsg.value = err.message;
    notifyError(err.message);
  }
}

async function handleDelete(id) {
  errorMsg.value = "";
  try {
    await apiRequest(`/movies/deleteMovie/${id}`, {
      method: "DELETE",
      token: authState.token,
    });
    notifySuccess("Movie deleted!");
    await fetchMovies();
  } catch (err) {
    errorMsg.value = err.message;
    notifyError(err.message);
  }
}

onMounted(async () => {
  try {
    await fetchMovies();
  } catch (err) {
    errorMsg.value = err.message;
    notifyError(err.message);
  }
});
</script>

<template>
  <section>
    <h2>Admin Dashboard</h2>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

    <form @submit.prevent="handleSubmitMovie" style="display: grid; gap: 0.75rem; max-width: 520px; margin-bottom: 1.75rem;">
      <input v-model="form.title" type="text" placeholder="Title" required />
      <input v-model="form.director" type="text" placeholder="Director" required />
      <input v-model="form.year" type="number" placeholder="Year" required />
      <input v-model="form.genre" type="text" placeholder="Genre" required />
      <textarea v-model="form.description" placeholder="Description" required />
      <div style="display: flex; gap: 0.5rem;">
        <button type="submit">{{ editingId ? "Save Update" : "Add Movie" }}</button>
        <button v-if="editingId" type="button" @click="resetForm">Cancel</button>
      </div>
    </form>

    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Director</th>
          <th>Year</th>
          <th>Genre</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movie in movies" :key="movie._id || movie.id">
          <td>{{ movie.title }}</td>
          <td>{{ movie.director }}</td>
          <td>{{ movie.year }}</td>
          <td>{{ movie.genre }}</td>
          <td>{{ movie.description }}</td>
          <td>
            <div class="actions-cell">
              <button type="button" @click="startEdit(movie)">Update</button>
              <button type="button" @click="handleDelete(movie._id || movie.id)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>