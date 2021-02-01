import Vue from "vue";
import Vuex from "vuex";

import { dataService } from "../shared";

import {
  ADD_CHECKLIST,
  DELETE_CHECKLIST,
  GET_CHECKLISTS,
  UPDATE_CHECKLIST,
  /* GET_CHECKLIST, */
} from "./mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    checklists: [],
    checklist: {},
  },

  mutations: {
    [GET_CHECKLISTS](state, checklists) {
      state.checklists = checklists;
      console.log(state.checklists);
    },
    /* [GET_CHECKLIST](state, checklist) {
      state.checklist = checklist;
      console.log(state.checklist);
    }, */
    [ADD_CHECKLIST](state, checklist) {
      state.checklists.push(checklist);
    },
    [DELETE_CHECKLIST](state, checklist) {
      state.checklists = [
        ...state.checklists.filter((c) => c._id !== checklist._id),
      ];
    },
    [UPDATE_CHECKLIST](state, checklist) {
      const index = state.checklists.findIndex((c) => c._id === checklist._id);
      state.checklists.splice(index, 1, checklist);
      state.checklists = [...state.checklists];
    },
  },

  actions: {
    async getChecklistsAction({ commit }) {
      const checklists = await dataService.getChecklists();
      commit(GET_CHECKLISTS, checklists);
    },
    /* async getChecklistAction({ commit }, _id) {
      const checklist = await dataService.getChecklist(_id);
      commit(GET_CHECKLIST, checklist);
    }, */
    async addChecklistAction({ commit }, checklist) {
      const addedChecklist = await dataService.addDatabaseChecklist(checklist);
      commit(ADD_CHECKLIST, addedChecklist);
    },
    async deleteChecklistAction({ commit }, checklist) {
      const deletedChecklistId = await dataService.deleteDatabaseChecklist(
        checklist
      );
      commit(DELETE_CHECKLIST, deletedChecklistId);
    },
    async updateChecklistAction({ commit }, checklist) {
      const updatedChecklist = await dataService.updateChecklist(checklist);
      commit(UPDATE_CHECKLIST, updatedChecklist);
    },
  },

  getters: {
    getChecklistById: (state) => (_id) =>
      state.checklists.find((c) => c._id === _id),
    getOneChecklist: (state) => state.checklist,
  },
});
