import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Management from "../views/Management.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/user",
    name: "Management",
    component: Management,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
