export const checklistsMixin = {
  methods: {
    async addChecklist(addChecklistName, archivedInput) {
      this.checklist = {
        checklistName: addChecklistName,
        archived: archivedInput,
        pages: {
          pageName: "Start editing your new checklist",
        },
      };
      await this.addChecklistAction(this.checklist);
      this.loadChecklists();
      this.closeModal();
    },

    async copyChecklist(copyInput, archivedInput) {
      let copiedChecklist = {
        checklistName: copyInput,
        active: false,
        archived: archivedInput,
        description: this.checklistToCopy.description,
        pages: this.checklistToCopy.pages
      };
      await this.addChecklistAction(copiedChecklist);
      this.archiveInput = false;
      this.loadChecklists();
      this.closeModal();
    },

    async deleteChecklist() {
      if (this.checklistToDelete) {
        await this.deleteChecklistAction(this.checklistToDelete);
      }
      this.loadChecklists();
      this.closeModal();
    },

    askToCopy(checklist) {
      this.checklistToCopy = checklist;
      this.modalMessage = `Choose a name for the copy of "${checklist.checklistName}" checklist:`;
      this.showCopyModal = true;
    },
    askToAdd() {
      this.showAddModal = true;
    },
    askToDelete(checklist) {
      this.checklistToDelete = checklist;
      this.modalMessage = `Are you sure you want to delete "${checklist.checklistName}" checklist?`;
      this.showDeleteModal = true;
    },

    closeModal() {
      this.showDeleteModal = false;
      this.showAddModal = false;
      this.showCopyModal = false;
    },
  },
  computed: {
    operationalChecklists() {
      const result = this.checklists.filter((checklist) => checklist.archived === false);
      return result;
    },
    archivedChecklists() {
      const result = this.checklists.filter((checklist) => checklist.archived === true);
      return result;
    },
    filteredChecklists() {
      let filter;
      if (this.showArchive === false) {
        filter = this.operationalChecklists;
      } else {
        filter = this.archivedChecklists;
      }
      return filter;
    },
    checklistNames() {
      let namesArray = [];
      this.checklists.forEach((checklist) => {
        namesArray.push(checklist.checklistName);
      });
      return namesArray;
    },
  },
};
