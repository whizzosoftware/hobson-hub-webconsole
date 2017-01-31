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
		  'executeTask': 'onExecuteTask',
			'deleteTask': 'onDeleteTask',
      'enableTask': 'onEnableTask'
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
				ctx.tasksView = new TasksView({model: model});
				ctx.$el.find('.tasks').html(
					ctx.tasksView.render().el
				);
			}, function(ctx, model) {
				toastr.error(strings.ErrorOccurred);
			});

			return this;
		},

    onExecuteTask: function(event, task) {
      if (confirm(strings.AreYouSureYouWantToManuallyExecute + ' \"' + task.get('name') + '\"?')) {
        TaskService.executeTask(this, task.get('@id'), function() {}, function() {
          toastr.error(strings.TaskExecuteFailure);
        });
      }
    },

		onDeleteTask: function(event, task) {
			if (confirm(strings.AreYouSureYouWantToDelete + ' \"' + task.get('name') + '\"?')) {
				task.destroy({
					context: this,
					error: function(model, response) {
						if (response.status !== 202) {
							toastr.error(strings.TaskDeleteFailure);
						}
					}.bind(this)
				});
			}
		},

    onEnableTask: function(event, task) {
		  if (confirm((task.get('enabled') ? strings.AreYouSureYouWantToDisable : strings.AreYouSureYouWantToEnable) + '\"' + task.get('name') + '\"?')) {
        TaskService.enableTask(task.get('@id'), !task.get('enabled'), function() {
        }, function() {
          toastr.error(strings.TaskEnableFail);
        })
      }
    }

	});

	return TasksTabView;
});
