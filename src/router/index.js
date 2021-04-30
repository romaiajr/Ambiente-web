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
    beforeEnter: (to, from, next) => {
      if (sessionStorage.getItem("token") != undefined) next();
      else next({ name: "Login" });
    },
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
