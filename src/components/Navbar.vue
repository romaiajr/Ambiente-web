<template>
  <div>
    <!-- Navbar -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <v-avatar color="grey" size="56">
              <v-icon x-large color="white">mdi-account</v-icon>
            </v-avatar>
          </v-list-item-title>
          <v-list-item-subtitle>
            <h6>{{username}}</h6>
            <small>{{type}}</small>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <!-- Function List -->
      <v-list nav>
        <v-list-item-group
          v-model="group"
          active-class="text--accent-4"
          color="var(--primary-color)"
        >
          <v-list-item
            shapped
            v-for="(item, idx) in navItems"
            :key="idx"
            @click="handleClick(item.value)"
          >
            <v-icon>{{ item.icon }}</v-icon>
            <v-list-item-title style="margin-left: 8px">
              <p>{{ item.title }}</p>
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list-item shapped justify-end @click="logout">
        <v-icon>mdi-logout</v-icon>
        <v-list-item-title style="margin-left: 8px">
          Sair
        </v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar color="var(--primary-dark-color)" style="color: white">
      <v-app-bar-nav-icon
        color="white"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title><h5>Ambiente Web</h5></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>
<script>
import navlist from "../utils/navlist.json";
export default {
  props: ["current"],
  data: () => ({
    drawer: false,
    group: 0,
    deviceWidth: undefined,
    username: "",
    type: ""
  }),
  created(){
    this.username = sessionStorage.getItem("username");
    this.type = sessionStorage.getItem("type");
  },
  computed: {
    navItems() {
      let user_type = sessionStorage.getItem("user_type");
      if (user_type == 1) {
        return navlist.adm;
      } else return navlist.tutor;
    },
  },
  methods: {
    handleClick(value) {
      this.$emit("clicked", value);
      if (this.deviceWidth <= 1264) {
        this.drawer = !this.drawer;
      }
    },
    logout() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user_type");
      sessionStorage.removeItem("username");
      window.location.replace("http://localhost:8080/");
    },
  },
  watch: {
    drawer() {
      this.deviceWidth =
        window.innerWidth > 0 ? window.innerWidth : screen.width;
    },
    current() {
      this.group = this.current;
    },
  },
};
</script>
<style scoped>
.function-title {
  margin-left: 8px !important;
}
</style>
