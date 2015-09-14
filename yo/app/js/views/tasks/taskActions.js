// Filename: views/tasks/taskActions.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/tasks/taskAction',
	'i18n!nls/strings'
], function($, _, Backbone, TaskActionView, strings) {

	var TaskActionsView = Backbone.View.extend({

		tagName: 'ul',

		className: 'actions',

		initialize: function(options) {
			this.subviews = [];
			this.devices = options.devices;
			this.task = options.task;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			if (this.task.actionSet.actions && this.task.actionSet.actions.length > 0) {
				this.$el.html('');
				var actions = this.task.actionSet.actions;
				for (var i = 0; i < actions.length; i++) {
					var actionView = new TaskActionView({
						action: actions[i]
					});
					var rv = actionView.render().el;
					this.$el.append(rv);
					this.subviews.push(actionView);
				}
			} else {
 				this.$el.html('<p class="notice">' + strings.TaskThenHelpText + '</p>');
			}

			return this;
		}

	});

	return TaskActionsView;
});