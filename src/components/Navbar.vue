<template>
  <div>
    <!-- Navbar -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <!-- Function List -->
      <v-list nav>
        <v-list-item-group v-model="group" active-class="text--accent-4">
          <v-list-item
            v-for="(item, idx) in navItems"
            :key="idx"
            @click="handleClick(item.value)"
          >
            <v-icon>{{ item.icon }}</v-icon>
            <v-list-item-title style="margin-left: 8px">{{
              item.title
            }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Ambiente Web</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>
<script>
import navlist from "../utils/navlist.json";
export default {
  data: () => ({
    drawer: false,
    group: null,
    deviceWidth: undefined,
  }),
  computed: {
    navItems() {
      return navlist.adm;
    },
  },
  methods: {
    handleClick(value) {
      this.$emit("clicked", value);
      if (this.deviceWidth <= 1264) {
        this.drawer = !this.drawer;
      }
    },
  },
  watch: {
    drawer() {
      this.deviceWidth =
        window.innerWidth > 0 ? window.innerWidth : screen.width;
    },
  },
};
</script>
<style scoped>
.function-title {
  margin-left: 8px !important;
}
</style>
