// Filename: views/tasks/tasksTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'views/collection/tasks',
	'i18n!nls/strings',
	'text!templates/tasks/tasksTab.html'
], function($, _, Backbone, toastr, TasksView, strings, tasksTemplate) {

	var TasksTabView = Backbone.View.extend({

		template: _.template(tasksTemplate),

		events: {
			'deleteTask': 'onDeleteTask'
		},

		initialize: function(options) {
			this.userId = options.userId;
			this.hubId = options.hubId;
			this.tasks = options.tasks;
		},

		remove: function() {
			if (this.tasksView) {
				this.tasksView.remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				tasks: this.tasks
			}));

			if (this.tasksView) {
				this.tasksView.remove();
			}
			this.tasksView = new TasksView({model: this.tasks});
			this.$el.find('.tasks').html(
				this.tasksView.render().el
			);

			return this;
		},

		onDeleteTask: function(event, task) {
			task.destroy({
				context: this,
				error: function(model, response, options) {
					if (response.status === 202) {
						options.context.render();
					} else {
						toastr.error('Failed to delete task. See log for details.');
					}
				}
			});
		}

	});

	return TasksTabView;
});