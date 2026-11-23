<script setup>
import { RouterLink, useRouter } from "vue-router";
import { authState } from "../stores/auth.js";
import { notifySuccess } from "../notify.js";

const router = useRouter();

function handleLogout() {
  authState.clearSession();
  notifySuccess("Logged out.");
  router.push("/login");
}
</script>

<template>
  <nav>
    <RouterLink to="/movies">Movies</RouterLink>
    <RouterLink v-if="authState.isAdmin" to="/addMovie">Add Movie</RouterLink>
    <RouterLink v-if="!authState.token" to="/login">Login</RouterLink>
    <RouterLink v-if="!authState.token" to="/register">Register</RouterLink>
    <button v-if="authState.token" type="button" @click="handleLogout">Logout</button>
  </nav>
</template>