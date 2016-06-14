define([
	'jquery',
	'underscore',
	'backbone',
	'services/task',
	'views/tasks/taskCondition',
	'i18n!nls/strings'
], function($, _, Backbone, TaskService, TaskConditionView, strings) {

	var TaskConditionsView = Backbone.View.extend({

		tagName: 'ul',

		className: 'conditions',

		initialize: function(options) {
			this.devices = options.devices;
			this.task = options.task;
			this.conditionClasses = options.conditionClasses;
			this.subviews = [];
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			var conditions = this.task.get('conditions');
			if (conditions && conditions.length > 0) {
				var tix = this.task.getTriggerConditionIndex(this.conditionClasses);

				// add view for trigger condition
				var cv = new TaskConditionView({
					devices: this.devices,
					condition: conditions[tix],
					conditionClasses: this.conditionClasses
				});
				this.$el.append(cv.render().el);
				this.subviews.push(cv);

				// add view for additional conditions
				for (var i=0; i < conditions.length; i++) {
					if (i != tix) {
						cv = new TaskConditionView({
							devices: this.devices,
							condition: conditions[i],
							conditionClasses: this.conditionClasses
						});
						this.$el.append('<p class="task-list-connector">AND</p>');
						this.$el.append(cv.render().el);
						this.subviews.push(cv);
					}
				}
			} else {
				this.$el.html('<p class="notice">' + strings.TaskIfHelpText + '</p>');
			}

			return this;
		}

	});

	return TaskConditionsView;
});