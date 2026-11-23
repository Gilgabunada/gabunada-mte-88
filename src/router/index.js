import { createRouter, createWebHistory } from "vue-router";
import { authState } from "../stores/auth.js";
import RegisterPage from "../pages/RegisterPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import MoviesPage from "../pages/MoviesPage.vue";
import MovieDetailPage from "../pages/MovieDetailPage.vue";
import AdminDashboardPage from "../pages/AdminDashboardPage.vue";

const routes = [
  { path: "/", redirect: "/movies" },
  {
    path: "/register",
    component: RegisterPage,
    meta: { guestOnly: true },
  },
  {
    path: "/login",
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: "/movies",
    component: MoviesPage,
  },
  {
    path: "/movies/:id",
    component: MovieDetailPage,
  },
  {
    path: "/addMovie",
    component: AdminDashboardPage,
    meta: { requiresAdmin: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/movies",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.guestOnly && authState.token) {
    return "/movies";
  }

  if (to.meta.requiresAdmin && !authState.isAdmin) {
    return "/movies";
  }
});

export default router;