<template>
  <div id="app">
    <vue-particles
      class="particles"
      color="#ffc0cb"
      :particleOpacity="0.6"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="1"
      linesColor="#dedede"
      :lineLinked="false"
      :moveSpeed="0.4"
      :hoverEffect="false"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <Header class="header-box"></Header>
    <div class="centered">
      <nav class="navbar" v-show="this.$route.name !== 'Digital Checklist'">
        <ul class="navbar-nav">
          <li class="arrows">
            <v-icon
              name="angle-double-right"
              class="arrows-icon"
              scale="1.5"
            ></v-icon>
            <h6 class="arrows-text">Menu</h6>
          </li>
          <router-link
            class="nav-link"
            v-for="item in menuItems"
            :key="item.title"
            router
            :to="item.link"
          >
            <li class="nav-item">
              <v-icon
                class="nav-icon"
                :class="{ active: item === currentRoute }"
                :name="item.icon"
                scale="1.5"
              >
              </v-icon>

              <span class="link-text"
                ><h6>
                  {{ item.title }}
                </h6>
              </span>
            </li>
          </router-link>
        </ul>
      </nav>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  components: {
    Header,
  },
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
  mounted() {
    this.currentRoute = this.$route.params.path;
  },
  methods: {
    // toggleMenu() {
    //   this.menuOpen = !this.menuOpen;
    //   setTimeout(() => {
    //     this.menuOpen = false;
    //   }, 6000);
    // },
  },
};
</script>

<style lang="scss">
@import "@/design/index.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.navbar {
  transition: $animation-long;
  width: 3.8rem !important;
  z-index: 3;
  &:hover {
    width: 14rem !important;
    background-color: $pane;
    .arrows {
      font-weight: 500;
      .arrows-icon {
        color: $edit-yellow;
        margin-left: 10rem;
        transform: rotate(-180deg);
      }
    }
  }
  // &:hover + .router-view {
  //   background-color: $modal-dark;
  //     // z-index: -1;
  // }

  .navbar-nav {
    height: 96%;
    list-style: none;
    text-align: center;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nav-link {
    width: 100%;
    height: 4rem;
    color: var(--text-primary);
    filter: grayscale(100%) opacity(0.7);
    transition: $animation-short;
    &:hover {
      filter: grayscale(0%) opacity(1);
      background: var(--bg-secondary);
      color: $edit-yellow;
    }
    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0rem 1rem 0rem 1rem;
      nav-icon {
        width: 1rem;
        min-width: 1rem;
      }
      .active {
        color: $edit-yellow;
      }
    }
  }
}

.link-text {
  display: inline;
  position: absolute;
  left: -999px;
  transition: $animation-long;
  margin-right: 0rem;
}

.arrows {
  font-weight: bold;
  font-size: 1.5rem;
  width: 100%;
  margin: 1rem 1rem 1rem 1rem;
  .arrows-text {
    text-transform: uppercase;
    margin-left: 1rem;
    display: inline;
    position: absolute;
    left: -500px;
    transition: $animation-long;
  }
  .arrows-icon {
    transform: rotate(0deg);
    transition: $animation-long;
    margin-left: -0.5rem;
  }
}

/* Small screens */
@media only screen and (max-width: 900px) {
  .navbar {
    bottom: 0;
    width: 100vw;
    height: 5rem;
  }

  .arrows {
    display: none;
  }

  .navbar-nav {
    flex-direction: row;
  }

  // .nav-link {
  // }

  main {
    margin: 0;
  }
}

/* Large screens */
@media only screen and (min-width: 600px) {
  .navbar {
    top: 0;
    width: 5rem;
    height: 100vh;
  }

  .navbar:hover {
    width: 16rem;
  }

  .navbar:hover .link-text {
    display: inline;
    left: 0px;
    position: relative;
    margin-right: 0rem;
  }

  .navbar:hover .arrows svg {
    margin-left: 11rem;
  }

  .navbar:hover .arrows-text {
    left: 0px;
  }
}

.dark {
  --text-primary: #b6b6b6;
  --text-secondary: #ececec;
  --bg-primary: #23232e;
  --bg-secondary: #141418;
}

.light {
  --text-primary: #1f1f1f;
  --text-secondary: #000000;
  --bg-primary: #ffffff;
  --bg-secondary: #e4e4e4;
}

.solar {
  --text-primary: #576e75;
  --text-secondary: #35535c;
  --bg-primary: #fdf6e3;
  --bg-secondary: #f5e5b8;
}

.theme-icon {
  display: none;
}

.dark #darkIcon {
  display: block;
}

.light #lightIcon {
  display: block;
}

.solar #solarIcon {
  display: block;
}
</style>
