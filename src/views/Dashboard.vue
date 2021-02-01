<template>
  <div class="router-view">
    <div class="dashboard-panes">
      <div class="dashboard-pane full">
        <div class="pane-heading">
          <h6>Shifts Overview</h6>
        </div>
        <div class="shifts">
          <ShiftProgress class="shift" v-for="checklist in operationalChecklists" :key="checklist._id" :checklist="checklist" />
        </div>
      </div>
      <div class="dashboard-pane two">
        <div class="pane-heading">
          <h6>Messages</h6>
        </div>
      </div>
      <div class="dashboard-pane two">
        <div class="pane-heading">
          <h6>Satellite Status</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShiftProgress from "../components/ShiftProgress";
import { checklistsMixin } from "../shared";

import { mapState, mapActions } from "vuex";

export default {
  name: "Dashboard",
  components: {
    ShiftProgress,
  },
  mixins: [checklistsMixin],

  data() {
    return {
      polling: null,
    };
  },
  created() {
    this.loadChecklists();
    this.pollData();
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    ...mapActions(["getChecklistsAction"]),
    async loadChecklists() {
      await this.getChecklistsAction();
    },
    pollData() {
      this.polling = setInterval(() => {
        this.loadChecklists();
      }, 10000);
    },
  },
  computed: {
    ...mapState(["checklists"]),
  },
  
};
</script>

<style lang="scss" scoped>
@import "@/design/index.scss";

.router-view {
  position: absolute;
  justify-content: center;
  margin: 20px 20px 20px 20px;
  height: 84vh;
  width: 100vw;
  .dashboard-panes {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    height: 100%;
    width: 70%;
    .dashboard-pane {
      display: flex;
      flex-direction: column;
      text-align: center;
      margin: 15px;
      background-color: $pane;
      height: 50%;
      width: 20%;
      .pane-heading {
        display: flex;
        justify-content: center;
        margin: 5px;
      }
      .shifts {
        display: flex;
        flex-direction: row;
        .shift {
          margin: 20px;
          &:first-child {
            margin-left: 40px;
          }
          &:last-child {
            margin-right: 40px;
          }
        }
      }
    }
    .two {
      width: calc(50% - 30px);
    }
    .three {
      width: 60%;
    }
    .full {
      overflow: auto;

      width: 100%;
    }
  }
}
</style>
