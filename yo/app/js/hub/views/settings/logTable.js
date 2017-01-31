// Filename: views/logList.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/settings/logEntry.html'
], function($, _, Backbone, strings, logEntryTemplate) {

	return Backbone.View.extend({
		tagName: 'table',

		attributes: {
			width: '100%'
		},

		template: _.template(logEntryTemplate),

		render: function() {
		  console.log('render');
			this.$el.append('<thead><td>Level</td><td>Time</td><td>Thread</td><td>Message</td></thead>');
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var logEntry = this.model.at(i);
					this.$el.append(this.template({entry: logEntry}));
				}
			} else {
				this.$el.append('<tr><td class="text-center" style="padding: 25px;" colspan="4">The log is empty.</td></tr>');
			}
			return this;
		}
	});

});
