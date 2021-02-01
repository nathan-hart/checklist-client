<template>
  <div class="router-view" v-if="checklist">
    <transition name="fade" mode="out-in">
      <div class="checklist-edit-container">
        <div v-if="checklist.pages.length === 0" class="empty-page">
          <v-icon class="editor-icon" name="meh-blank" prop="far" scale="8" />
          <h3>You have no pages. To start, create a page.</h3>
        </div>

        <swiper class="swiper" :options="swiperOption" ref="mySwiper">
          <swiper-slide class="slide page-container" id="slide" v-for="(page, i) in checklist.pages" :key="i">
            <div class="edit-page">
              <div class="empty"></div>
              <h3 v-if="!editing.pageName">{{ page.pageName }}</h3>
              <div v-else>
                <transition name="fade">
                  <input
                    type="text"
                    class="checklist-title"
                    v-model="checklist.pages[i].pageName"
                    @blur="donePageEdit()"
                    @keyup.enter="donePageEdit()"
                    @keyup.esc="cancelPageEdit(i)"
                    dir="auto"
                  />
                </transition>
              </div>
              <div class="page-icons">
                <h3 class="editor-icon" :class="{ update: page.updatePage }" v-on:click="toggleUpdate(i)">U</h3>
                <v-icon class="editor-icon edit" name="edit" v-on:click="editPage(i)" />
                <v-icon class="editor-icon delete delete-page" name="times-circle" v-on:click="deletePage(i)" />
              </div>
            </div>
            <draggable tag="div" class="list-group" v-bind="dragOptions" v-model="page.tasks">
              <div
                class="list-group-item"
                :class="{ bold: task.bold }"
                v-for="(task, y) in page.tasks"
                :key="y"
                :index="y"
                dir="auto"
                style="text-align: start"
              >
                <v-icon v-if="!page.updatePage || task.bold" class="check-circle-inactive" name="check-circle" />
                <v-icon v-else name="check-circle" class="empty-icon" />
                <span>
                  {{ task.taskName }}
                </span>
                <div class="edit-icons">
                  <v-icon class="editor-icon delete" name="times-circle" v-on:click="deleteTask(i, y)" />
                  <v-icon class="editor-icon bold-edit" name="bold" @click="embolden(i, y)" />
                </div>
              </div>
            </draggable>

            <form class="footer-input" @submit.prevent="addTask(i)">
              <input type="text" placeholder="enter task name..." v-model="taskNameInput" dir="auto" />
            </form>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </transition>

    <div class="editing-container">
      <div class="edit-checklist-name">
        <div>
          <h5>You are currently editing</h5>
          <transition name="fade" mode="out-in">
            <div v-if="!editing.checklistName" class="checklist-name" key="1">
              <p class="checklist-title">{{ checklist.checklistName }} Checklist</p>
              <v-icon class="editor-icon edit" name="edit" v-on:click="editChecklistData(editing.checklistName)" />
            </div>
            <div v-else class="editing-checklist-name" key="2">
              <div>
                <input
                  type="text"
                  ref="checklistTitle"
                  class="checklist-title-input"
                  v-model="checklist.checklistName"
                  @blur="doneChecklistEdit()"
                  @keyup.enter="doneChecklistEdit()"
                  dir="auto"
                />
              </div>
            </div>
          </transition>
        </div>
        <div class="op-selector">
          <h5>Checklist Type:</h5>
          <div class="options">
            <div class="option" :class="{ 'active-option': this.checklist.archived }" key="archive" @click="arToggle()">
              <v-icon class="editor-icon edit" name="archive" />
              <h4>Archived</h4>
            </div>
            <div class="option" :class="{ 'active-option': !this.checklist.archived }" key="operational" @click="opToggle()">
              <h4>Operational</h4>
              <v-icon class="editor-icon add" name="satellite" />
            </div>
          </div>
        </div>
      </div>
      <div class="edit-pages">
        <h5>Pages Overview</h5>
        <div class="add-page">
          <form @submit.prevent="addPage()">
            <input class="input-checklist-page" type="text" placeholder="enter page name..." v-model="pageNameInput" dir="auto" />
            <button class><v-icon class="editor-icon add flipY" name="file-alt" />Add Page</button>
          </form>
        </div>
        <draggable
          tag="div"
          class="page-overview"
          :list="checklist.pages"
          :disabled="!enabled"
          handle=".page-small"
          @start="drag = true"
          @end="drag = false"
        >
          <div v-for="(page, i) in checklist.pages" :key="i" v-on:click="activePage(i)" :class="{ 'page-small': true, active: i === currentPage }">
            <p>{{ page.pageName }}</p>
            <p v-if="page.updatePage" class="update-page-marker">Updates Page</p>
            <p>
              {{ i + 1 }}
            </p>
          </div>
        </draggable>
      </div>
      <div class="save">
        <div class="messages">
          <transition name="fade">
            <div class="message-box" v-if="message !== null">
              <h5>{{ message }}</h5>
            </div>
          </transition>
        </div>
        <div class="buttons">
          <button @click="saveChanges(dbid)">
            <v-icon class="editor-icon add flipY" name="save" />
            Save
          </button>
          <button @click="cancel()">
            <v-icon class="editor-icon info rotate" name="undo" />
            Undo
          </button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <EditorModal
        v-if="showModal"
        v-on:handleCancel="cancelLeave"
        v-on:handleLeave="leaveRoute"
        v-on:handleSaveAndLeave="saveAndLeaveRoute"
        :message="modalMessage"
      ></EditorModal>
    </transition>
  </div>
</template>

<script>
import EditorModal from "@/components/checklists/EditorModal";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import draggable from "vuedraggable";

import { mapGetters, mapActions } from "vuex";
import { cloneDeep } from "lodash";
import { editorSwiper } from "../shared";

export default {
  name: "EditChecklist",
  components: {
    EditorModal,
    Swiper,
    SwiperSlide,
    draggable,
  },
  mixins: [editorSwiper],
  data() {
    return {
      showModal: false,
      modalMessage: "",
      desiredRoute: "",
      // editing functionality
      beforeEditCache: "",
      editing: {
        checklistName: false,
        pageName: false,
        taskName: false,
      },
      //
      dbid: this.$route.params._id,
      changes: false,
      taskName: "",
      pageNameInput: "",
      taskNameInput: "",
      updateInput: "",
      message: null,
      currentPage: 0,
      checklist: {},
    };
  },
  created() {
    this.checklist = cloneDeep(this.getChecklistById(this.dbid));
  },
  mounted() {
    this.$refs.mySwiper.$swiper.on("slideChange", () => {
      this.onSwipe(this);
    });
  },
  beforeRouteLeave(to, from, next) {
    console.log(to.path);
    this.desiredRoute = to.path;
    if (this.changes) {
      this.modalMessage = `${this.checklist.checklistName} has unsaved changes. Are you sure you want to leave? `;
      this.showModal = true;
    } else {
      next();
    }
  },
  methods: {
    ...mapActions(["updateChecklistAction"]),

    saveChanges() {
      this.dbid = this.updateChecklistAction(this.checklist);
      this.message = "checklist saved";
      this.changes = false;
      setTimeout(() => (this.message = null), 3000);
    },
    cancel() {
      this.checklist = cloneDeep(this.getChecklistById(this.dbid));
    },

    onSwipe(variable) {
      this.currentPage = variable.$refs.mySwiper.$swiper.activeIndex;
      console.log(`current slide: ${variable.$refs.mySwiper.$swiper.activeIndex + 1}`);
    },

    editChecklistData() {
      this.beforeEditCache = this.checklist.checklistName;
      this.editing.checklistName = true;
      this.$refs.checklistTitle.focus();
    },

    doneChecklistEdit() {
      this.editing.checklistName = false;
      this.changes = true;
    },

    opToggle() {
      this.checklist.archived = false;
      this.saveChanges();
    },
    arToggle() {
      this.checklist.archived = true;
      this.saveChanges();
    },

    addPage() {
      if (this.pageNameInput.trim().length === 0) {
        return;
      }
      this.checklist.pages.push({
        pageName: this.pageNameInput,
        updatePage: false,
        tasks: [],
      });
      this.pageNameInput = "";
      this.$refs.mySwiper.$swiper.slideTo(this.checklist.pages.length + 1);
      this.currentPage = this.checklist.pages.length - 1;
      this.changes = true;
    },
    toggleUpdate(i) {
      this.checklist.pages[i].updatePage = !this.checklist.pages[i].updatePage;
    },
    editPage(i) {
      this.beforeEditCache = this.checklist.pages[i].pageName;
      this.editing.pageName = true;
    },
    donePageEdit() {
      this.editing.pageName = false;
      this.changes = true;
    },
    cancelPageEdit(i) {
      this.checklist.pages[i].pageName = this.beforeEditCache;
      this.editing.pageName = false;
    },
    deletePage(i) {
      this.checklist.pages.splice(i, 1);
      this.changes = true;
    },
    addTask(i) {
      this.checklist.pages[i].tasks.push({
        taskName: this.taskNameInput,
        bold: false,
        done: false,
      });
      this.taskNameInput = "";
      this.changes = true;
    },
    deleteTask(i, y) {
      this.checklist.pages[i].tasks.splice(y, 1);
      this.changes = true;
    },
    embolden(i, y) {
      this.checklist.pages[i].tasks[y].bold = !this.checklist.pages[i].tasks[y].bold;
      this.changes = true;
    },

    activePage(i) {
      this.$refs.mySwiper.$swiper.slideTo(i, 500);
      this.currentPage = i;
    },

    leaveRoute() {
      this.changes = false;
      this.$router.push(`${this.desiredRoute}`);
    },
    saveAndLeaveRoute() {
      this.saveChanges();
      this.$router.push(`${this.desiredRoute}`);
    },
    cancelLeave() {
      this.showModal = false;
    },
  },
  computed: {
    ...mapGetters(["getChecklistById"]),
    draggingInfo() {
      return this.drag ? "under drag" : "";
    },
    dragOptions() {
      return {
        animation: 1000,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/design/index.scss";

.flip-list {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.router-view {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  margin: 0px;
  position: absolute;
  height: 94vh;
  width: 100vw;
  .checklist-edit-container {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    width: 30%;
    min-width: 550px;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    .empty-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 90%;
      background-color: $pane;

      .editor-icon {
        margin: 20px;
        opacity: 0.3;
        text-align: center;
        color: $header-grey;
      }
    }
    .swiper {
      width: 100%;
      height: 90%;
      .slide {
        display: flex;
        margin: 0px;
        flex-direction: column;
        align-items: center;
        padding: 0px 5px 5px 5px;
        height: 100%;
        width: 100%;
        max-width: 100% !important;
        background-color: $pane;
        overflow: auto;
        .edit-page {
          width: 100%;
          display: grid;
          grid-template-columns: 20% 60% 20%;
          grid-template-areas: ".empty h3 .page-icons";
          flex-direction: row;
          justify-content: space-between;
          transition: $animation;
          vertical-align: middle;
          h3 {
            padding: 5px;
            text-transform: uppercase;
            color: $text-main;
          }
          .page-icons {
            display: flex;
            justify-content: space-around;
            align-items: center;
            visibility: hidden;
            margin-right: 5px;
            float: right;
            margin-left: 10px;
            h3 {
              font-weight: 600;
              color: $border-grey;
              &:hover {
                color: $edit-yellow;
              }
            }
            .update {
              color: $edit-yellow;
            }
          }
          &:hover {
            background-color: $light-pane;
            .page-icons {
              visibility: visible;
            }
          }
        }
        .list-group {
          width: 100%;
          height: 90%;
          overflow: auto;
          .list-group-item {
            text-align: left;
            font-size: 0.95em;
            padding: 2px;
            vertical-align: middle;
            z-index: 9999 !important;
            transition: $animation-short;
            span {
              user-select: none;
              transition: $animation-short;
            }
          }
          .bold {
            transition: $animation;
            color: $text-main;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin: 20px 0px 0px -30px;
            .bold-edit {
              color: $edit-yellow;
            }
          }
          .edit-icons {
            display: inline-block;
            position: absolute;
            min-width: 60px;
            visibility: hidden;
            right: 5px;
            .editor-icon {
              transition: $animation;

              margin-right: 5px;
              float: right;
              margin-left: 10px;
              transform: translateY(3px);
            }
          }
          .check-circle-inactive {
            padding: 0px 10px 0px 10px;
            transform: translateY(3px);
            opacity: 0.5;
          }
          .empty-icon {
            padding: 0px 0px 0px 0px;
            transform: translateY(3px);
            opacity: 0;
          }
          .list-group-item:hover {
            background-color: $light-pane;
            .edit-icons {
              visibility: visible;
            }
          }
        }
        .footer-input {
          width: 100%;
          margin: 20px 0px 20px 0px;
          text-align: center;
          input {
            width: 95%;
            margin-bottom: 30px;
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
        transition: $animation;
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
  }

  .editing-container {
    display: flex;
    justify-content: space-between;
    justify-content: flex-start;
    flex-direction: column;
    width: 30%;
    min-width: 550px;
    height: 90%;
    margin-right: 20px;
    h5 {
      text-align: center;
      font-size: 0.8rem;
    }
    .edit-checklist-name {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 20%;
      border-bottom: 1px solid $light-pane;
      padding: 20px 10px 0px 10px;
      .checklist-name {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 5px;
        .editor-icon {
          padding: 5px;
        }
      }
      .editing-checklist-name {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 5px;
      }
    }
    .edit-pages,
    .updates-overview {
      .change {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 5px;
        right: 7px;
        transition: $animation-short;
        &:hover h4,
        .editor-icon {
          color: white;
        }
      }
      position: relative;
      height: 70%;
      // background-color: $header;
      overflow: auto;
      h5 {
        margin: 20px 0px 0px 0px;
      }
      .add-page {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 15px 10px 0px 10px;
        .input-checklist-page {
          border-radius: 5px 0px 0px 5px;
        }
        form {
          display: flex;
          flex-direction: row;
        }
      }
      .page-overview {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 0px 0px 15px 0px;
        flex-wrap: wrap;

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
  }
  .save {
    height: 10%;
    // background-color: $header;
    border-top: 1px solid $light-pane;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .messages {
      height: 50%;
      .message-box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50%;
        width: 100%;
        background-color: $checklist-green-fade;
        h5 {
          font-weight: bold;
          color: black;
          padding: 0px 10px 0px 10px;
        }
      }
    }
    .buttons {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      min-width: 300px;
    }
  }
}
.op-selector {
  max-width: 100%;
  .options {
    max-width: 70%;
  }
}
.add-page {
  margin: 0px;
}
</style>
