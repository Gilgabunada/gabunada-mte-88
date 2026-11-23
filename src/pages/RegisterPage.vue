<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiRequest } from "../api.js";
import { notifySuccess, notifyError } from "../notify.js";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);

async function handleRegister() {
  errorMsg.value = "";
  loading.value = true;

  try {
    await apiRequest("/users/register", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });
    notifySuccess("Registration successful! Please log in.");
    router.push("/login");
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
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">{{ loading ? "Registering..." : "Register" }}</button>
    </form>
    <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
  </section>
</template>