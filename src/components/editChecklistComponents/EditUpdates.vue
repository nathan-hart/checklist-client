<template>
  <div class="updates-page">
    <h3>Updates</h3>
    <div
      v-for="(update, i) in checklist.updates"
      :key="i"
      class="update-item"
      style="text-align: start"
      dir="auto"
    >
      <span class="update-name">
        {{ update.updateName }}
      </span>
      <span class="update-date">
        {{ update.date }}
      </span>
      <v-icon class="editor-icon bold-edit" name="edit" @click="editUpdate()" />
      <v-icon
        class="editor-icon delete"
        name="times-circle"
        v-on:click="deleteUpdate(i)"
      />
    </div>

    <form class="footer-input" @submit.prevent="addUpdate()">
      <input
        type="text"
        placeholder="enter update name..."
        v-model="updateInput"
        dir="auto"
      />
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { cloneDeep } from "lodash";
// import moment from "moment";

export default {
  name: "EditUpdates",
  data() {
    return {
      updateInput: "",
      dbid: this.$route.params._id,
      checklist: {},
    };
  },
  created() {
    this.checklist = cloneDeep(this.getChecklistById(this.dbid));
  },
  methods: {
    ...mapActions(["updateChecklistAction"]),
    addUpdate() {
      this.checklist.updates.push({
        updateName: this.updateInput,
        // updateDate: moment().format("D/M/YYYY"),
      });
      // console.log(this.checklist.updates)
      console.log(this.updateInput);

      this.dbid = this.updateChecklistAction(this.checklist);

      this.updateInput = "";
    },
    deleteUpdate(i) {
      this.checklist.updates.splice(i, 1);
      this.dbid = this.updateChecklistAction(this.checklist);
    },
  },
  computed: {
    ...mapGetters(["getChecklistById"]),
  },
};
</script>

<style lang="scss" scoped>
@import "@/design/index.scss";

.updates-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  min-width: 550px;
  margin-left: 20px;
  height: 90%;
  background-color: $pane;
  .update-item {
    display: flex;
    width: 100%;
    padding: 4px 10px 4px 10px;
    .update-name {
      flex: 3;
      width: 80%;
    }
    .update-date {
      flex: 1;
      width: 20%;
    }
    .editor-icon {
      flex: 0.3;
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
</style>
