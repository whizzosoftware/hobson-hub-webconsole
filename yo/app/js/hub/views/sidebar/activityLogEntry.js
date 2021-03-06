// Filename: views/activity
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'i18n!nls/strings',
	'text!templates/sidebar/activityLogEntry.html'
], function($, _, Backbone, moment, strings, activityLogEntryTemplate) {

	var ActivityView = Backbone.View.extend({
		tagName: 'tr',

		className: 'activity',

		template: _.template(activityLogEntryTemplate),

		initialize: function(options) {
			this.timeString = options.timeString;
		},

		render: function() {
			this.$el.html(this.template({
				timeString: this.timeString,
				activity: this.model.toJSON()
			}));
			return this;
		}
	});

	return ActivityView;
});