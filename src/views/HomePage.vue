<template>
  <div class="router-view">
    <div class="nav-panes">
      <router-link
        class="pane"
        v-for="item in menuItems"
        :key="item.title"
        router
        :to="item.link"
      >
        <li class="nav-item">
          <v-icon class="nav-icon" :name="item.icon" scale="4"> </v-icon>

          <span class="text"
            ><h6>
              {{ item.title }}
            </h6>
          </span>
        </li>
      </router-link>
    </div>
    <div class="space-news"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { title: "Checklists", link: "/checklists", icon: "tasks" },
        { title: "Dashboard", link: "/dashboard", icon: "chart-bar" },
        { title: "Satellites", link: "/orbit-tracker", icon: "satellite" },
        { title: "Settings", link: "/settings", icon: "cogs" },
      ],
      currentRoute: null,
      menuOpen: true,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/design/index.scss";

.router-view {
  width: 100vw;
  display: flex;
  justify-content: center;
  // align-items: center;
  .nav-panes {
    width: 40%;
    .nav-item {
      display: flex;
      background-color: $pane;
      flex-direction: row;
      justify-content: space-between;
      padding: 40px;
      width: 90%;
      margin: 20px 0px 0px 0px;
      transition: $animation;
      .nav-icon {
        color: $header-grey;
        transition: $animation-short;
      }
      &:hover {
        background-color: $pane;
        .nav-icon {
          color: $text-main;
        }
      }
      .text {
        h6 {
          font-size: 2.5rem;
        }
      }
    }
  }
}
</style>
