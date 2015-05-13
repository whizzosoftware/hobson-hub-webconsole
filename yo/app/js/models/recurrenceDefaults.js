// Filename: models/recurrenceDefaults.js
define([
], function() {
	var RecurrenceDefaults = Backbone.Model.extend({

		defaults: {
			values: [
				{name: 'every day', value: 'FREQ=DAILY;INTERVAL=1'},
				{name: 'every 2 days', value: 'FREQ=DAILY;INTERVAL=2'},
				{name: 'every 3 days', value: 'FREQ=DAILY;INTERVAL=3'},
				{name: 'every 4 days', value: 'FREQ=DAILY;INTERVAL=4'},
				{name: 'every 5 days', value: 'FREQ=DAILY;INTERVAL=5'},
				{name: 'every 6 days', value: 'FREQ=DAILY;INTERVAL=6'},
				{name: 'every week', value: 'FREQ=WEEKLY;INTERVAL=1'},
				{name: 'every 2 weeks', value: 'FREQ=WEEKLY;INTERVAL=2'},
				{name: 'every 3 weeks', value: 'FREQ=WEEKLY;INTERVAL=3'},
				{name: 'every month', value: 'FREQ=MONTHLY;INTERVAL=1'},
				{name: 'every 2 months', value: 'FREQ=MONTHLY;INTERVAL=2'},
				{name: 'every 3 months', value: 'FREQ=MONTHLY;INTERVAL=3'},
				{name: 'every 4 months', value: 'FREQ=MONTHLY;INTERVAL=4'},
				{name: 'every 5 months', value: 'FREQ=MONTHLY;INTERVAL=5'},
				{name: 'every 6 months', value: 'FREQ=MONTHLY;INTERVAL=6'},
				{name: 'every 7 months', value: 'FREQ=MONTHLY;INTERVAL=7'},
				{name: 'every 8 months', value: 'FREQ=MONTHLY;INTERVAL=8'},
				{name: 'every 9 months', value: 'FREQ=MONTHLY;INTERVAL=9'},
				{name: 'every 10 months', value: 'FREQ=MONTHLY;INTERVAL=10'},
				{name: 'every 11 months', value: 'FREQ=MONTHLY;INTERVAL=11'},
				{name: 'every year', value: 'FREQ=YEARLY;COUNT=1'}
			]
		},

		getNameForValue: function(value) {
			var vals = this.get('values');
			for (var i=0; i < vals.length; i++) {
				if (vals[i].value === value) {
					return vals[i].name;
				}
			}
			return null;
		}

	});

	return RecurrenceDefaults;
});