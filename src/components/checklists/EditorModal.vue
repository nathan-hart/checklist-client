<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background" @click="onCancel()"></div>
    <div class="modal-card">
      <h5>{{ message }}</h5>
      <button class="modal-card-title" @click="onCancel()"><v-icon class="editor-icon info flipX" name="backspace" />Cancel</button>
      <button class="modal-card-title" @click="onSaveAndLeave()">Save and Leave</button>
      <button class="modal-card-title" @click="onLeave()">Leave without Saving</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditorModal",
  data() {
    return {};
  },
  props: {
    message: {
      type: String,
      default: () => "",
    },
    isOpen: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    onCancel() {
      this.$emit("handleCancel");
    },
    onLeave() {
      this.$emit("handleLeave");
    },
    onSaveAndLeave() {
      this.$emit("handleSaveAndLeave");
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
