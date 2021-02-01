<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background" @click="onCancel()"></div>
    <div class="modal-card">
      <div class="modal-header">
        <h5 class="modal-card-title">{{ message }}</h5>
      </div>
      <div class="modal-card-divider"></div>

      <form class="modal-form" v-on:submit.prevent="submitForm()">
        <label class="input-label">Checklist Name:</label>
        <input
          v-model.trim="$v.copyName.$model"
          :class="{ 'input-error': $v.copyName.$error }"
          placeholder="Copied checklist"
          ref="copyName"
        />
        <div
          class="error"
          key="error1"
          v-show="!$v.copyName.required && $v.copyName.$dirty"
        >
          Field is required
        </div>

        <div class="error" key="error2" v-show="!$v.copyName.minLength">
          Name must have at least
          {{ $v.copyName.$params.minLength.min }} letters.
        </div>
        <div
          class="error"
          key="error3"
          v-show="this.checklistNames.includes($v.copyName.$model)"
        >
          Name must be unique
        </div>
      </form>
      <div class="op-selector">
        <label class="input-label">Checklist Type:</label>
        <div class="options">
          <div
            class="option"
            :class="{ 'active-option': archivedInput }"
            key="archive"
            @click="arToggle()"
          >
            <v-icon class="editor-icon edit" name="archive" />
            <h4>Archived</h4>
          </div>
          <div
            class="option"
            :class="{ 'active-option': !archivedInput }"
            key="operational"
            @click="opToggle()"
          >
            <h4>Operational</h4>
            <v-icon class="editor-icon add" name="satellite" />
          </div>
        </div>
      </div>
      <div class="buttons-container">
        <button class="button" @click="onCancel()">
          <v-icon class="editor-icon info flipX" name="backspace" />Cancel
        </button>
        <button class="button" @click="submitForm()">
          <v-icon class="editor-icon add flipY" name="clone" />Copy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "CopyModal",
  data() {
    return {
      copyName: "",
      archivedInput: false,
      submitStatus: null,
    };
  },
  validations: {
    copyName: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(40),
    },
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
    checklistNames: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.$refs.copyName.focus();
  },
  methods: {
    submitForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.onCopy();
      } else {
        this.submitStatus = "ERROR";
      }
    },
    onCancel() {
      this.$emit("handleCancel");
    },
    onCopy() {
      this.$emit("handleSave", this.copyName, this.archivedInput);
      this.copyName = "";
      this.archivedInput = false;
    },
    opToggle() {
      this.archivedInput = false;
    },
    arToggle() {
      this.archivedInput = true;
    },
  },
};
</script>
