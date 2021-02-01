<template>
  <div class="router-view">
    <div class="checklist-container">
      <div class="menu">
        <h5 v-if="checklists.length === 0">
          You have no checklists. To proceed, create a new checklist.
        </h5>
        <h5 v-else>Select a checklist, or create a new checklist.</h5>
        <button v-on:click="askToAdd()">
          <v-icon class="editor-icon add flipY" name="file-medical" />
          New checklist
        </button>
      </div>
      <transition name="fade" mode="out-in">
        <div class="checklist-list" :key="this.showArchive">
          <h5 class="type-title" v-if="!this.showArchive">
            Operational Checklists
          </h5>
          <h5 v-else>Archived Checklists</h5>
          <ul>
            <li v-for="checklist in filteredChecklists" :key="checklist._id">
              <v-icon v-if="!checklist.archived" class="editor-icon satellite" :class="{ active: checklist.active }" name="satellite" />
              <v-icon v-else class="editor-icon satellite" name="archive" />
              <div class="checklist-name" v-on:click="gotoOperate(checklist)">
                {{ checklist.checklistName }}
              </div>
              <div class="buttons">
                <v-icon class="editor-icon delete" name="times-circle" v-on:click="askToDelete(checklist)" />
                <v-icon class="editor-icon edit" name="clone" v-on:click="askToCopy(checklist)" />
                <v-icon class="editor-icon edit" :class="{ inactive: checklist.active }" v-on:click="gotoEdit(checklist)" name="edit" />
              </div>
            </li>
          </ul>
        </div>
      </transition>
      <div class="checklists-message">
        <transition name="fade">
          <h4 v-if="checklistsMessage !== null">{{ checklistsMessage }}</h4>
        </transition>
      </div>

      <transition name="fade">
        <CopyModal
          v-if="showCopyModal"
          @handleCancel="closeModal"
          v-on:handleSave="copyChecklist"
          :message="modalMessage"
          :checklistNames="this.checklistNames"
        ></CopyModal>
      </transition>
      <transition name="fade">
        <AddModal v-if="showAddModal" @handleCancel="closeModal" v-on:handleSave="addChecklist" :checklistNames="this.checklistNames"></AddModal>
      </transition>
      <transition name="fade">
        <DeleteModal v-if="showDeleteModal" @handleCancel="closeModal" @handleYes="deleteChecklist" :message="modalMessage"></DeleteModal>
      </transition>

      <transition name="fade" mode="out-in">
        <h4 v-on:click="archiveSwitch()" class="archive-switch" :key="this.showArchive">
          <v-icon v-if="showArchive" class="editor-icon " name="satellite" />
          <v-icon v-else class="editor-icon" name="archive" />
          View
          {{ this.showArchive === false ? "Archived" : "Operational" }}
          Checklists ({{ this.showArchive === false ? archivedChecklists.length : operationalChecklists.length }})
        </h4>
      </transition>
    </div>
  </div>
</template>

<script>
import DeleteModal from "@/components/checklists/DeleteModal";
import AddModal from "@/components/checklists/AddModal";
import CopyModal from "@/components/checklists/CopyModal";

import { mapState, mapActions } from "vuex";
import { checklistsMixin } from "../shared";

export default {
  name: "Checklists",
  components: {
    CopyModal,
    DeleteModal,
    AddModal,
  },
  mixins: [checklistsMixin],

  data() {
    return {
      showDeleteModal: false,
      showAddModal: false,
      showCopyModal: false,
      checklistToDelete: null,
      checklistToCopy: null,
      modalMessage: "",
      checklistsMessage: null,
      showArchive: false,
    };
  },
  created() {
    this.loadChecklists();
  },
  methods: {
    ...mapActions(["getChecklistsAction", "deleteChecklistAction", "addChecklistAction", "updateChecklistAction"]),
    async loadChecklists() {
      await this.getChecklistsAction();
    },
    archiveSwitch() {
      this.showArchive = !this.showArchive;
    },
    gotoEdit(checklist) {
      if (checklist.active) {
        this.checklistsMessage = `The ${checklist.checklistName} shift is active at this time.  You cannot edit an active checklist.`;
        setTimeout(() => (this.checklistsMessage = null), 4000);
      } else {
        this.$router.push(`/editor/${checklist._id}`);
      }
    },
    gotoOperate(checklist) {
      if (checklist.archived) {
        this.checklistsMessage = `The ${checklist.checklistName} shift is archived.  You cannot operate an archived checklist.  To operate, edit the checklist and change its status to operational.`;
        setTimeout(() => (this.checklistsMessage = null), 4000);
      } else {
        this.$router.push(`/checklists/${checklist._id}`);
      }
    },
  },
  computed: {
    ...mapState(["checklists"]),
  },
};
</script>

<style lang="scss">
@import "@/design/index.scss";

.router-view {
  position: absolute;
  width: 100vw;
  align-items: center;
  flex-direction: column;
  .checklist-container,
  h4 {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .menu {
      display: flex;
      flex-direction: row;
      width: 80%;
      justify-content: space-between;
      margin: 20px;
      h5 {
        padding: 10px 10px 10px 0px;
        font-size: 1rem;
      }
    }
    .checklist-list {
      width: 80%;
      li {
        display: grid;
        grid-template-areas: ".satellite .checklist-name .buttons";
        grid-template-columns: 4% 76% 20%;
        padding: 10px;
        border-bottom: 1px solid $light-pane;
        &:last-child {
          border-bottom: none;
        }
        .checklist-name {
          color: $text-main;
        }
        .satellite {
          opacity: 40%;
          align-self: center;
        }
        .active {
          opacity: 100%;
          color: $checklist-green-fade;
        }
        &:hover {
          .buttons {
            visibility: visible;
          }
        }
        .buttons {
          visibility: hidden;
          align-self: center;

          .editor-icon {
            margin-right: 5px;
            float: right;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .checklists-message {
    width: 80%;
    height: 2rem;
    h4 {
      width: 100%;
      margin: 0.5rem;
      align-items: flex-start;
    }
  }
  .archive-switch {
    margin: 2rem;
    transition: $animation-short;
    &:hover {
      color: white;
      .editor-icon {
        color: white;
      }
    }
  }
}
</style>
