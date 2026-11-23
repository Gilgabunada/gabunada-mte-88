<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiRequest } from "../api.js";
import { authState } from "../stores/auth.js";
import { notifySuccess, notifyError } from "../notify.js";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);

async function handleLogin() {
  errorMsg.value = "";
  loading.value = true;

  try {
    const data = await apiRequest("/users/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    const token = data.access || data.token || data.accessToken || "";
    const user = data.user || (data.isAdmin !== undefined || data.role ? data : null);
    authState.setSession({ token, user });
    notifySuccess("Logged in successfully!");
    router.push(authState.isAdmin ? "/addMovie" : "/movies");
  } catch (err) {
    errorMsg.value = err.message;
    notifyError(err.message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section style="max-width: 420px; margin: 2rem auto;">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">{{ loading ? "Logging in..." : "Login" }}</button>
    </form>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
  </section>
</template>