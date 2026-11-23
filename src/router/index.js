import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import MoviesPage from "../pages/MoviesPage.vue";
import MovieDetailPage from "../pages/MovieDetailPage.vue";
import AdminDashboardPage from "../pages/AdminDashboardPage.vue";

const routes = [
  { path: "/", redirect: "/movies" },
  { path: "/register", component: RegisterPage },
  { path: "/login", component: LoginPage },
  { path: "/movies", component: MoviesPage },
  { path: "/movies/:id", component: MovieDetailPage },
  { path: "/addMovie", component: AdminDashboardPage },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});