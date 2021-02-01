import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from "./../store/index";

import Checklists from '../views/Checklists.vue';
import Dashboard from '../views/Dashboard.vue';
import OperatorChecklist from '../views/OperatorChecklist.vue';
import HomePage from '../views/HomePage.vue';
import EditChecklist from '../views/EditChecklist'
import Settings from '../views/Settings'


Vue.use(VueRouter);

// const parseProps = r => ({ _id: parseInt(r.params._id)})

const router = new VueRouter({
  mode: 'history',
  // linkActiveClass: "active",
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Digital Checklist',
      component: HomePage
    },
    {
      path: '/checklists',
      name: 'Checklists',
      component: Checklists
    },
    {
      path: '/editor/:_id',
      name: 'Checklist Editor',
      component: EditChecklist,
    },
    {
      path: '/checklists/:_id',
      name: 'Operator Checklist',
      component: OperatorChecklist
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },{
      
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})

// router.beforeEach(async (to, from, next) => {
//   // make sure we always have job openings
//   if (store.state.checklists.length === 0) {
//     await store.dispatch('getChecklistsAction')
//   } else {
//     next()
//   }
// })

export default router;