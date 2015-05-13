// Filename: models/logEntry.js
define([
	'backbone'
], function(Backbone) {
	var LogEntryModel = Backbone.Model.extend({
		dateString: function() {
			var timestamp = this.get('time');
			return (timestamp) ? new Date(parseFloat(timestamp)).toLocaleString() : null;
		},
		icon: function() {
			switch (this.get('level')) {
				case 'INFO':
					return 'fa-info-circle';
				case 'WARN':
					return 'fa-warning';
				case 'ERROR':
					return 'fa-times';
				case 'DEBUG':
					return 'fa-bug';
				case 'TRACE':
					return 'fa-arrow-circle-down';
				default:
					return '';
			}
		}
	});

	return LogEntryModel;
});