// Filename: views/collection/task.js
define([
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'i18n!nls/strings',
  'text!templates/collection/task.html'
], function ($, _, Backbone, moment, strings, template) {

  return Backbone.View.extend({

    tagName: 'li',

    template: _.template(template),

    events: {
      'click': 'onClick',
      'click #delete-task': 'onClickDelete',
      'click #enable-task': 'onClickEnable'
    },

    render: function () {
      this.$el.html(
        this.template({
          strings: strings,
          task: this.model.toJSON(),
          schedule: this.createSchedule(this.model)
        })
      );

      return this;
    },

    onClick: function (e) {
      if (e.toElement.className.indexOf('task-tile') > -1) {
        this.$el.trigger('executeTask', this.model);
      }
    },

    onClickDelete: function (e) {
      e.preventDefault();
      this.$el.trigger('deleteTask', this.model);
    },

    onClickEnable: function(e) {
      e.preventDefault();
      this.$el.trigger('enableTask', this.model);
    },

    onTaskUpdate: function (e) {
      this.model.set('name', e.name);
      this.model.set('description', e.description);
      this.model.set('enabled', e.enabled);
      this.model.set('properties', e.properties);
      this.render();
    },

    createSchedule: function (task) {
      var now = moment();
      var schedule = {};
      if (task.get('properties') && task.get('properties').scheduled) {
        schedule.active = true;
        var nextRun = new moment(task.get('properties').nextRunTime);
        if (!nextRun.isBefore(now)) {
          schedule.nextRunStr = strings.NextRun + ' ' + nextRun.fromNow();
        }
      }
      return schedule;
    }

  });

});
