// Filename: models/logEntries.js
define([
	'backbone',
	'models/logEntry'
], function(Backbone, LogEntry) {

	var LogEntriesModel = Backbone.Collection.extend({
		model: LogEntry,

		initialize: function(url) {
			this.url = url;
		}
	});

	return LogEntriesModel;
});