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
			if (confirm(strings.AreYouSureYouWantToDelete + ' \"' + task.get('name') + '\"?')) {
				task.destroy({
					context: this,
					success: function(model, response, options) {
						toastr.success(strings.TaskDeleteSuccess);
						options.context.render();
					},
					error: function(model, response, options) {
						if (response.status === 202) {
							toastr.success(strings.TaskDeleteSuccess);
							options.context.render();
						} else {
							toastr.error(strings.TaskDeleteFailure);
						}
					}
				});
			}
		}

	});

	return TasksTabView;
});