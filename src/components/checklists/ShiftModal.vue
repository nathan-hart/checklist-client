<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background" @click="onCancel()"></div>
    <div class="modal-card">
      <button v-if="this.message.includes('Start')" class="modal-card-title" @click="onStart()">
        <v-icon class="editor-icon add flipX" name="play-circle" />{{ message }}
      </button>
      <button v-else class="modal-card-title" @click="onFinish()"> <v-icon class="editor-icon add flipY" name="clipboard-check" />{{ message }}</button>
      <button class="modal-card-title" @click="onCancel()"><v-icon class="editor-icon info flipX" name="backspace" />Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShiftModal",
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
    
    onStart() {
      this.$emit("handleStart");
    },
    onFinish() {
      this.$emit("handleFinish");
    },
    onCancel() {
      this.$emit("handleCancel");
    },
    onProceed() {
      this.$emit("handleProceed");
    },
    onSaveAndProceed() {
      this.$emit("handleSaveAndProceed");
    },
  },
};
</script>

<style lang="scss" scoped>

.modal-card {
  height: 150px;
}
</style>
