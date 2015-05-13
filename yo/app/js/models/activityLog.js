// Filename: models/activityLog.js
define([
	'backbone',
	'models/activityLogEntry'
], function(Backbone, ActivityLogEntryModel) {
	var ActivityLogCollection = Backbone.Collection.extend({

		model: ActivityLogEntryModel,

		initialize: function(url) {
			this.url = url;
		}
	});

	return ActivityLogCollection;
});