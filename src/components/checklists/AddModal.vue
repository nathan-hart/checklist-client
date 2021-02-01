<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background" @click="onCancel()"></div>
    <div class="modal-card">
      <div class="modal-header">
        <h5 class="modal-card-title">Add a new checklist:</h5>
      </div>
      <div class="modal-card-divider"></div>

      <form class="modal-form" v-on:submit.prevent="submitForm()">
        <h5>Checklist Name:</h5>

        <input v-model.trim="$v.addChecklistName.$model" placeholder="must be at least 3 characters" ref="checklistNameInput" />
        <div  class="error" >
          <div v-if="errorActive">
            <!-- <transition-group name="fade" mode="out-in"> -->
            <div key="error1" v-show="!$v.addChecklistName.required && $v.addChecklistName.$dirty">
              Name is required
            </div>

            <div key="error2" v-show="!$v.addChecklistName.minLength">
              Name must have at least
              {{ $v.addChecklistName.$params.minLength.min }} letters.
            </div>

            <div key="error3" v-show="this.checklistNames.includes($v.addChecklistName.$model)">
              Name must be unique
            </div>
          </div>
          <!-- </transition-group> -->
        </div>
      </form>

      <div class="op-selector">
        <h5>Checklist Type:</h5>
        <div class="options">
          <div class="option" :class="{ 'active-option': archivedInput }" key="archive" @click="arToggle()">
            <v-icon class="editor-icon edit" name="archive" />
            <h4>Archived</h4>
          </div>
          <div class="option" :class="{ 'active-option': !archivedInput }" key="operational" @click="opToggle()">
            <h4>Operational</h4>
            <v-icon class="editor-icon add" name="satellite" />
          </div>
        </div>
      </div>
      <div class="buttons-container">
        <button @click="onCancel()"><v-icon class="editor-icon info flipX" name="backspace" />Cancel</button>
        <button @click="submitForm()"><v-icon class="editor-icon add flipY" name="file-medical" />Save</button>
        <!-- <p class="typo__p" v-if="submitStatus === 'ERROR'">
          Please check input.
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "AddModal",
  data() {
    return {
      addChecklistName: "",
      archivedInput: true,
      submitStatus: null,
      errorActive: true,
    };
  },
  validations: {
    addChecklistName: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(40),
    },
  },
  props: {
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
    this.$refs.checklistNameInput.focus();
  },
  methods: {
    submitForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.onSave();
      } else {
        this.submitStatus = "ERROR";
      }
    },
    onCancel() {
      this.$emit("handleCancel");
    },
    onSave() {
      this.$emit("handleSave", this.addChecklistName, this.archivedInput);
      this.errorActive = false;
      this.archivedInput = false;
      this.addChecklistName = "";
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
