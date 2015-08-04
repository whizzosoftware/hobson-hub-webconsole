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

	return Backbone.View.extend({
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
			var cclass = cond.cclass['@id'];
			var props = cond.values;

			if (cclass.endsWith('schedule')) {
				var time;
				if (props.time.charAt(0) === 'S') {
					time = props.time.substring(0,2) === 'SR' ? 'sunrise' : 'sunset';
				} else {
					time = moment(props.time, 'HH:mm:ssZ').format('LT');
				}
				var date = moment(props.date);
				var s = 'The time is ' + time + ' ';
				if (props.recurrence && props.recurrence !== 'never') {
					s += this.recurrenceDefaults.getNameForValue(props.recurrence) + ' starting on ' + date.format('L');
				} else {
					s += 'on ' + date.format('L');
				}
				return s;
			} else if (cclass.endsWith('turnOff')) {
				return this.createOrDescription(props.devices) + ' turns off';
			} else if (cclass.endsWith('turnOn')) {
				return this.createOrDescription(props.devices) + ' turns on';
			} else if (cclass.endsWith('tempAbove')) {
				return this.createOrDescription(props.devices) + ' rises above ' + props.tempF + "&deg;";
			} else if (cclass.endsWith('tempBelow')) {
				return this.createOrDescription(props.devices) + ' drops below ' + props.tempF + "&deg;";
			} else {
				return 'Something else happens';
			}
		},

		createOrDescription: function(array) {
			if (array) {
				var s = '';
				for (var i=0; i < array.length; i++) {
					s += array[i].name;
					if (i < array.length - 1) {
						s += ' or ';
					}
				}
				return s;
			} else {
				return 'A device';
			}
		},

		getDevice: function(deviceId) {
			for (var i=0; i < this.devices.length; i++) {
				var device = this.devices.at(i);
				if (deviceId === device.get('@id')) {
					return device;
				}
			}
			return null;
		}

	});

});