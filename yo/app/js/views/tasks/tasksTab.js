// Filename: views/tasks/tasksTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/collection/tasks',
	'i18n!nls/strings',
	'text!templates/tasks/tasksTab.html'
], function($, _, Backbone, TasksView, strings, tasksTemplate) {

	var TasksTabView = Backbone.View.extend({

		template: _.template(tasksTemplate),

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
			console.debug('tasks tab render', this.tasks);

			this.$el.append(this.template({
				strings: strings,
				tasks: this.tasks
			}));

			if (this.tasks.length > 0) {
				if (this.tasksView) {
					this.tasksView.remove();
				}
				this.tasksView = new TasksView({tasks: this.tasks});
				this.$el.find('.tasks').html(
					this.tasksView.render().el
				);
			} else {
				this.$el.find('.tasks').html(
					'<p class="notice">No tasks have been created.</p>'
				);
			}

			return this;
		}

	});

	return TasksTabView;
});