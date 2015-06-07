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

		subviews: [],

		initialize: function(options) {
			this.devices = options.devices;
			this.task = options.task;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			if (this.task.hasActions()) {
				var actions = this.task.get('actionSet').actions;
				for (var i = 0; i < actions.length; i++) {
					var actionView = new TaskActionView({
						action: actions[i]
					});
					var rv = actionView.render().el;
					this.$el.append(rv);
					this.subviews.push(actionView);
				}
			} else {
 				this.$el.html('<p class="notice">' + strings.TaskThenHelpText + '<br/>' + strings.NoActionsNotice + '</p>');
			}

			return this;
		}

	});

	return TaskActionsView;
});