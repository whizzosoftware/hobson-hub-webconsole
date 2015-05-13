// Filename: views/tasks/taskCondition.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'models/recurrenceDefaults',
	'i18n!nls/strings',
	'text!templates/tasks/taskCondition.html'
], function($, _, Backbone, moment, RecurrenceDefaults, strings, taskConditionTemplate) {

	var TaskConditionView = Backbone.View.extend({
		template: _.template(taskConditionTemplate),

		tagName: 'li',

		className: 'condition',

		initialize: function(options) {
			this.devices = options.devices;
			this.condition = options.condition;
			this.recurrenceDefaults = new RecurrenceDefaults();
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				condition: this.condition,
				description: this.createDescription(this.condition)
			}));
			return this;
		},

		createDescription: function(cond) {
			var props = cond.properties;
			switch (cond.conditionClassId) {
				case 'schedule':
					var time;
					if (props.time.value.charAt(0) === 'S') {
						time = props.time.value.substring(0,2) === 'SR' ? 'sunrise' : 'sunset';
					} else {
						time = moment(props.time.value, 'HH:mm:ssZ').format('LT');
					}
					var date = moment(props.date.value);
					var s = 'The time is ' + time + ' ';
					if (props.recurrence && props.recurrence.value !== '') {
						s += this.recurrenceDefaults.getNameForValue(props.recurrence.value) + ' starting on ' + date.format('L');
					} else {
						s += 'on ' + date.format('L');
					}
					return s;
				default:
					return 'Something else happens';
			}
		}

	});

	return TaskConditionView;
});