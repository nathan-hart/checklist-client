<template>
  <div class="shift-card">
    <div class="card-title">
      <p>{{ checklist.checklistName }}</p>
    </div>
    <vue-circle
      :progress="percentage"
      ref="progressCircle"
      :size="110"
      line-cap="square"
      :fill="fill"
      :empty-fill="emptyFill"
      :animation-start-value="0.0"
      :start-angle="3.14 * 1.5 + 0.05"
      insert-mode="append"
      :thickness="4"
      :show-percent="false"
    >
      <h6 v-if="percentage == 0 || isNaN(percentage)">Inactive</h6>
      <h6 v-else>{{ percentage }}%</h6>
    </vue-circle>

    <h5>Last completed task:</h5>
    <p v-if="lastTask">{{ lastTask.taskName }}</p>
    <p v-else>Shift not started</p>
    <div class="card-buttons">
      <div></div>
    </div>
  </div>
</template>

<script>
import { percentagesMixin } from "../shared";

import VueCircle from "vue2-circle-progress";

export default {
  name: "ShiftProgress",
  props: ["checklist"],
  mixins: [percentagesMixin],
  components: {
    VueCircle,
  },
  data() {
    return {
      fill: { gradient: ["rgba(255, 255, 0, 0.76)"] },
      emptyFill: "rgba(211, 211, 211, 0.2)",
      updatePercent: null,
    };
  },
  mounted: function() {
    console.log(this.percentage);
    console.log(this.checklist.lastCompletedTask);
  },
  created() {
    this.pollData();
  },
  beforeDestroy() {
    clearInterval(this.updatePercent);
  },
  methods: {
   pollData() {
      this.updatePercent = setInterval(() => {
        this.$refs.progressCircle.updateProgress(this.percentage);
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/design/index.scss";

.shift-card {
  background-color: $pane;
  border: solid 1px $border-grey-fade;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 0px 0px;
  min-width: 11rem;
  max-width: 11rem;
  min-height: 90%;
  h5 {
    font-size: 0.8rem;
  }
  > * {
    margin: 0px 0px 7px 0px;
  }
  h6 {
    padding: 0px;
    margin: 0px;
  }
  .card-title {
    border-bottom: 1px solid $border-grey;
    width: 100%;
    min-height: 15%;
    p {
      margin: 5px;
    }
  }
}
</style>
