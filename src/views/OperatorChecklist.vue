<template>
  <div class="router-view">
    <div class="checklist-operator-container">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="cssVars"></div>
      </div>
      <swiper class="swiper" :options="swiperOption" ref="mySwiper">
        <swiper-slide class="slide page-container" id="slide" v-for="(page, i) in checklist.pages" :key="i">
          <div class="page-header">
            <h3>{{ page.pageName }}</h3>
          </div>
          <div tag="ul" class="list-group">
            <li
              class="list-group-item"
              v-for="(task, y) in page.tasks"
              :key="y"
              :class="{ done: task.completed, bold: task.bold }"
              dir="auto"
              style="text-align: start;"
            >
              <v-icon v-if="!page.updatePage || task.bold" class="check-circle" name="check-circle" @click="taskDone(i, y)" />
              <span class="text-test" @dblclick="addNote()">
                {{ task.taskName }}
              </span>
            </li>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div v-if="viewNotes" class="notes">
        <ul>
          <li v-for="(note, i) in notes" :key="i"></li>
        </ul>
      </div>
      <div class="ops-menu">
        <div class="notes-button" v-on:click="toggleNotes()"><h5>Notes</h5></div>
        <div class="updates"></div>
        <div class="showPages" v-on:click="togglePages()"><h5>Show Pages</h5></div>
      </div>
    </div>

    <transition name="fade">
      <div class="page-preview" v-show="viewPages">
        <div
          v-for="(page, i) in checklist.pages"
          :key="i"
          v-on:click="activePage(i)"
          :class="{ 'page-small': true, active: i === currentPage }"
          ref="smallPages"
        >
          <p>{{ page.pageName }}</p>
          <p v-if="page.updatePage" class="update-page-marker">Updates Page</p>
          <p>
            {{ i + 1 }}
          </p>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <ShiftModal
        v-if="showModal"
        @handleCancel="cancel"
        v-on:handleStart="startShift"
        v-on:handleCancel="cancel"
        v-on:handleFinish="finishShift"
        :message="modalMessage"
      ></ShiftModal>
    </transition>
  </div>
</template>

<script>
import ShiftModal from "@/components/checklists/ShiftModal";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import { percentagesMixin, operatorSwiper } from "../shared";
import { mapActions, mapGetters } from "vuex";
import { cloneDeep } from "lodash";

export default {
  name: "EditChecklist",
  components: {
    ShiftModal,
    Swiper,
    SwiperSlide,
  },
  mixins: [percentagesMixin, operatorSwiper],
  data() {
    return {
      currentPage: 0,
      modalMessage: "",
      showModal: false,
      // route data
      dbid: this.$route.params._id,
      checklist: {},
      //
      percent: null,
      viewPages: true,
      viewNotes: false,
      notes: [],
    };
  },
  created() {
    this.checklist = cloneDeep(this.getChecklistById(this.dbid));
    //
    if (this.checklist.active === false) {
      this.checklist.pages.forEach(function(page) {
        page.tasks.forEach(function(task) {
          task.completed = false;
        });
      });
      this.saveChanges();
      this.showModal = true;
      this.modalMessage = `Start ${this.checklist.checklistName} Shift`;
    }
  },
  mounted() {
    this.$refs.mySwiper.$swiper.on("slideChange", () => {
      this.onSwipe(this);
    });
  },
  methods: {
    ...mapActions(["updateChecklistAction"]),
    async loadChecklist() {
      await this.getChecklistsAction();
    },
    saveChanges() {
      this.dbid = this.updateChecklistAction(this.checklist);
    },
    lastPage() {
      this.$refs.mySwiper.$swiper.slideTo(5000);
    },
    async startShift() {
      this.showModal = false;
      this.checklist.active = true;
      this.updateChecklistAction(this.checklist);
    },
    async finishShift() {
      this.checklist.pages.forEach(function(page) {
        page.tasks.forEach(function(task) {
          task.completed = false;
        });
      });
      this.checklist.active = false;
      this.saveChanges();
      this.$router.push("/checklists");
    },
    cancel() {
      if (this.checklist.active === true) {
        this.showModal = false;
      } else {
        this.$router.push("/checklists");
      }
    },
    taskDone(i, y) {
      this.checklist.pages[i].tasks[y].completed = !this.checklist.pages[i].tasks[y].completed;
      this.saveChanges();
    },
    addNote() {
      console.log("note added");
    },
    toggleNotes() {
      this.viewNotes = !this.viewNotes;
    },
    togglePages() {
      this.viewPages = !this.viewPages;
    },
    onSwipe(variable) {
      let i = variable.$refs.mySwiper.$swiper.activeIndex;
      this.currentPage = i;
      console.log(`current slide: ${variable.$refs.mySwiper.$swiper.activeIndex + 1}`);
      variable.$refs.smallPages[i].scrollIntoView({ behavior: "smooth", block: "nearest" });
    },
    activePage(i) {
      this.$refs.mySwiper.$swiper.slideTo(i, 500);
      this.currentPage = i;
    },
  },
  watch: {
    percent(newVal) {
      console.log(newVal);
      if (newVal == 100) {
        this.lastPage();
        this.modalMessage = `Finish ${this.checklist.checklistName} Shift`;
        this.showModal = true;
      }
    },
  },
  computed: {
    ...mapGetters(["getChecklistById"]),
  },
};
</script>

<style lang="scss" scoped>
@import "@/design/index.scss";

input {
  width: 100px;
  height: 12px;
}

.router-view {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  margin: 0px;
  height: 94vh;
  width: 100vw;
  .checklist-operator-container {
    margin: 0px;
    display: flex;
    flex-direction: column;
    width: 35%;
    // min-width: 900px;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    .progress-bar-container {
      width: calc(100% - 2px);
      margin-bottom: -20px;
      height: 0.15rem;
      transform: scaleX(-1);
      background-image: linear-gradient(to right, $checklist-green, $text-main);
      .progress-bar {
        transition: $animation;
        height: 100%;
        width: var(--width);
        background-color: rgb(63, 63, 63);
      }
    }
    .swiper {
      width: 100%;
      height: 90%;
      .slide {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px 5px 5px 5px;
        height: 100%;
        width: 100%;
        background-color: $pane;
        .page-header {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          h3 {
            padding: 5px;
            text-transform: uppercase;
            color: $text-main;
          }
        }
        .list-group {
          overflow: auto;
          width: 100%;
          height: 90%;
          overflow: hidden;
          .list-group-item {
            background-color: rgba(255, 255, 255, 0);
            text-align: left;
            padding: 2px;
            transition: all 0.7s ease;
            color: $header-grey;
            margin: 0px 10px 0px 10px;

            .check-circle {
              padding: 0px;
              transform: translateY(3px);
              transition: $animation;
              &:hover {
                color: $checklist-green;
              }
            }
          }
          .bold {
            color: $text-main;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin: 20px -10px 0px -10px;
            .check-circle {
              visibility: hidden;
            }
          }
          .done {
            text-decoration: line-through;
            opacity: 0.7;
            .check-circle {
              color: $checklist-green;
            }
          }
        }
      }
      ::v-deep .swiper-pagination-bullet-custom {
        $size: 20px;
        width: $size !important;
        height: $size !important;
        line-height: $size !important;
        text-align: center;
        color: white;
        opacity: 0.7;
        background: rgba(rgb(153, 153, 153), 0.5);
        transition: all 1s;
        &:hover {
          opacity: 1;
        }
        &.swiper-pagination-bullet-active {
          opacity: 1;
          color: white;
          background: $light-pane;
          box-shadow: 0px 0px 5px 2px $text-main;
        }
      }
    }
    .notes {
      display: flex;
      position: absolute;
    }
    .ops-menu {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
      height: 5%;
      background-color: $pane;
      border-top: 1px solid $border-grey;
    }
  }
  .page-preview {
    width: auto;
    overflow: auto;
    height: 95%;
    margin: 1rem;
    .page-small {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 90px;
      height: 130px;
      margin: 10px;
      align-items: center;
      text-align: center;
      color: $text-main;
      background-color: $pane;
      transition: $animation;
      .update-page-marker {
        color: $header-grey;
      }
      p {
        font-size: 0.7rem;
        margin: 2px;
      }
    }
    .active {
      box-shadow: 0px 0px 5px 2px $text-main;
      border-radius: 5px;
      text-transform: uppercase;
    }
  }
}

.shift-button {
  height: 7rem;
  width: 16rem;
}
</style>
