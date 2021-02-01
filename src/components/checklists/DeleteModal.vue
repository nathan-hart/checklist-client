<template>
  <div class="modal" :class="{ isActive: isOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <div class="modal-header">
        <h5 class="modal-card-title">{{ message }}</h5>
      </div>
      <div class="modal-card-divider"></div>
      <div class="buttons-container">
        <button @keyup.esc="onCancel" @click="onCancel"><v-icon class="editor-icon info flipX" name="backspace" />Cancel</button>
        <button @click="onYes"><v-icon class="editor-icon delete flipY" name="trash-alt" />delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeleteModal",
  data() {
    return {
      isActive: "is-active",
    };
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
    onYes() {
      this.$emit("handleYes");
    },
  },
};
</script>

<style lang="scss" scoped>

.modal-card {
  height: 200px;
}

</style>
