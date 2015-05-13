// Filename: views/logList.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/settings/logEntry.html'
], function($, _, Backbone, strings, logEntryTemplate) {

	var LogTableView = Backbone.View.extend({
		tagName: 'table',
		
		attributes: {
			width: '100%'
		},

		template: _.template(logEntryTemplate),
		
		initialize: function(logEntries) {
			this.logEntries = logEntries;
			console.debug('log entries: ', logEntries);
		},

		render: function() {
			this.$el.append('<thead><td>Level</td><td>Time</td><td>Thread</td><td>Message</td></thead>');
			for (var i = 0; i < this.logEntries.length; i++) {
				var logEntry = this.logEntries.at(i);
				this.$el.append(this.template({entry: logEntry}));
			}
			return this;
		}
	});

	return LogTableView;
});