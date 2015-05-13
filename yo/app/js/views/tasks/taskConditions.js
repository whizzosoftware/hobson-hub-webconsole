define([
	'jquery',
	'underscore',
	'backbone',
	'views/tasks/taskCondition',
	'i18n!nls/strings'
], function($, _, Backbone, TaskConditionView, strings) {

	var TaskConditionsView = Backbone.View.extend({

		tagName: 'ul',

		className: 'conditions',

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
			if (this.task.hasConditions()) {
				var conditions = this.task.get('conditions');
				for (var i = 0; i < conditions.length; i++) {
					var conditionView = new TaskConditionView({
						devices: this.devices,
						condition: conditions[i]
					});
					var rv = conditionView.render().el;
					this.$el.append(rv);
					this.subviews.push(conditionView);
				}
			} else {
				this.$el.html('<p class="notice">' + strings.TaskIfHelpText + '<br/>' + strings.NoConditionsNotice + '</p>');
			}

			return this;
		}

	});

	return TaskConditionsView;
});