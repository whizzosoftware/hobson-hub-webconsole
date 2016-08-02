// Filename: views/collection/task.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'i18n!nls/strings',
	'text!templates/collection/task.html'
], function($, _, Backbone, moment, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		template: _.template(template),

		events: {
      'click': 'onClick',
			'click #delete-task': 'onClickDelete'
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					task: this.model.toJSON(),
					schedule: this.createSchedule(this.model)
				})
			);

			return this;
		},

    onClick: function() {
		  this.$el.trigger('executeTask', this.model);
    },

		onClickDelete: function() {
			this.$el.trigger('deleteTask', this.model);
		},

		createSchedule: function(task) {
			var now = moment();
			var schedule = {};
			if (task.get('properties') && task.get('properties').scheduled) {
				schedule.active = true;
				var nextRun = new moment(task.get('properties').nextRunTime);
				if (!nextRun.isBefore(now)) {
					schedule.nextRunStr = strings.NextRun + ' ' + nextRun.fromNow();
				}
			}
			return schedule;
		}

	});

});
