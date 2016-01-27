// Filename: views/tasks/tasksTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/task',
	'views/collection/tasks',
	'i18n!nls/strings',
	'text!templates/tasks/tasksTab.html'
], function($, _, Backbone, toastr, TaskService, TasksView, strings, tasksTemplate) {

	var TasksTabView = Backbone.View.extend({

		template: _.template(tasksTemplate),

		events: {
			'deleteTask': 'onDeleteTask'
		},

		initialize: function(options) {
			this.userId = options.userId;
			this.hubId = options.hubId;
		},

		remove: function() {
			if (this.tasksView) {
				this.tasksView.remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings
			}));

			if (this.tasksView) {
				this.tasksView.remove();
			}

			TaskService.getTasks(this, function(ctx, model) {
				console.debug(model);
				ctx.tasksView = new TasksView({model: model});
				ctx.$el.find('.tasks').html(
					ctx.tasksView.render().el
				);
			}, function(ctx, model) {
				toastr.error(strings.ErrorOccurred);
			});

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