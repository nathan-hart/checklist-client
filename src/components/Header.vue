<template>
  <div>
    <router-link to="/">
      <v-icon name="meteor" class="logo" scale="3"></v-icon>
    </router-link>
    <h1>{{ this.$route.name }}</h1>
    <div class="clock">
      <div class="clock-type">
        <h4 class="time-value" v-text="utcTime"></h4>
        <h4 class="timezone" v-text="utcTimeZone"></h4>
      </div>
      <div class="clock-type">
        <h4 class="time-value">{{ currentTime }}</h4>
        <h4 class="timezone">{{ currentTimeZone }}</h4>
      </div>
      <h4 class="date">{{ $moment().format("dddd Do MMMM YYYY") }}</h4>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Header",
  data() {
    return {
      currentTime: null,
      utcTime: null,
      currentTimeZone: null,
      utcTimeZone: null,
    };
  },
  created() {
    setInterval(() => this.updateCurrentTime(), 1 * 1000);
  },
  methods: {
    updateCurrentTime() {
      this.utcTime = moment.utc().format("HH:mm:ss");
      this.utcTimeZone = moment.utc().format("z");
      this.currentTime = moment().format("HH:mm:ss");
      this.currentTimeZone = moment().format("Z");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/design/index.scss";

.header-box {
  display: flex;
  align-items: center;
  background-color: $pane;
  width: 100%;
  border-image-slice: 1;
  height: 7vh;
  position: relative;
  width: 100%;
  margin: 0px;
  .logo {
    transition: $animation-short;
    grid-area: logo;
    height: 45px;
    margin: 1rem;
    color: $header-grey;
    &:hover {
      color: $edit-yellow;
    }
  }
  h5 {
    grid-area: title;
    align-items: center;
  }
  .clock {
    float: right;
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin-left: auto;
    margin-right: 15px;
    grid-area: clock;
    max-width: 17em;
    .clock-type {
      display: grid;
      grid-template-columns: 70% 30%;
      grid-template-areas: "time-value timezone";
      .time-value {
        grid-area: time-value;
        font-size: 0.8em;
        font-weight: bold;
        // margin-right: 10px;
      }
      .timezone {
        grid-area: timezone;
        font-size: 0.7em;
      }
    }
    .date {
      font-size: 0.8em;
    }
  }
}
</style>
