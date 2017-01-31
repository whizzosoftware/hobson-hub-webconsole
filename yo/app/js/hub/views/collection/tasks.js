// Filename: views/collection/tasks.js
define([
  'jquery',
  'underscore',
  'backbone',
  'toastr',
  'services/event',
  'views/collection/task',
  'i18n!nls/strings'
], function ($, _, Backbone, toastr, EventService, TaskView, strings) {

  return Backbone.View.extend({

    tagName: 'ul',

    className: 'small-block-grid-1 medium-block-grid-2 large-block-grid-3',

    initialize: function () {
      this.subviews = [];
      this.subscription = this.onTaskUpdated.bind(this);
      this.subscription2 = this.onTaskDeleted.bind(this);
      EventService.subscribe('taskUpdated', this.subscription);
      EventService.subscribe('taskDeleted', this.subscription2);
    },

    remove: function () {
      EventService.unsubscribe(this.subscription);
      EventService.unsubscribe(this.subscription2);

      for (var ix in this.subviews) {
        this.subviews[ix].remove();
        this.subviews[ix] = null;
      }

      Backbone.View.prototype.remove.call(this);
    },

    render: function () {
      if (this.model.length > 0) {
        for (var i = 0; i < this.model.length; i++) {
          var task = this.model.at(i);
          var v = new TaskView({model: task});
          this.$el.append(v.render().el);
          this.subviews.push(v);
        }
      } else {
        this.$el.html(
          '<p class="notice">' + strings.NoTasksCreated + '</p>'
        );
      }
      return this;
    },

    onTaskUpdated: function (e) {
      for (var ix in this.subviews) {
        var id = this.subviews[ix].model.get('@id');
        if (id === e.id) {
          this.subviews[ix].onTaskUpdate(e);
          break;
        }
      }
    },

    onTaskDeleted: function (e) {
      for (var ix in this.subviews) {
        var id = this.subviews[ix].model.get('@id');
        if (id === e.id) {
          const el = this.subviews[ix].$el;
          el.fadeOut(150, function() {
            el.remove();
          });
          break;
        }
      }
    }

  });

});
