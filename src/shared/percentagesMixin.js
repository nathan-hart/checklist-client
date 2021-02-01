export const percentagesMixin = {
  computed: {
    taskCount() {
      let tasksAbstract = [];
      this.checklist.pages.forEach(function(page) {
        if (!page.updatePage) {
          page.tasks.forEach(function(task) {
            if (task.bold === false) tasksAbstract.push(task);
          });
        }
      });
      return tasksAbstract;
    },

    doneCount() {
      let doneAbstract = [];
      this.checklist.pages.forEach(function(page) {
        if (!page.updatePage) {
          page.tasks.forEach(function(task) {
            if (task.completed === true && task.bold === false) doneAbstract.push(task);
          });
        }
      });
      return doneAbstract;
    },

    percentage() {
      this.percent = parseInt((this.doneCount.length / this.taskCount.length) * 100, 10);
      return this.percent;
    },

    lastTask() {
      let lt = [];
      this.checklist.pages.forEach(function(page) {
        page.tasks.forEach(function(task) {
          if (task.completed === true && task.bold === false) lt.push(task);
        });
      });
      return lt.slice(-1)[0];
    },

    cssVars: function() {
      return {
        "--width": 100 - this.percentage + "%",
      };
    },
  },
};
