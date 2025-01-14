import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "../views/LoginView.vue"
import RegisterView from "../views/RegisterView.vue"
import StopsView from "../views/StopsView.vue"
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/logout',
      name: 'logout',
      component: RegisterView,
      meta: { requiresAuth: true },
    },
    {
      path: '/stops',
      name: 'stops',
      component: StopsView,
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/my/stops',
    //   name: 'My Stops',
    //   component: MyStopsView,
    // },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if(to.name === "logout") {
    authStore.clearAuth()
    next('/login')
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: 'home' });
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' });
  }

  next();
});

export default router
