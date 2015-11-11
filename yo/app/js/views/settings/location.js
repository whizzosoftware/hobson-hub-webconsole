// Filename: views/settings/location.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'i18n!nls/strings',
	'text!templates/settings/location.html'
], function($, _, Backbone, moment, strings, template) {

	return Backbone.View.extend({

		tagName: 'tr',

		template: _.template(template),

		events: {
			'click #deleteButton': 'onDeleteClick'
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					moment: moment,
					location: this.model.toJSON(),
					locationType: this.model.isBeacon() ? 'Beacon' : 'Map'
				})
			);

			return this;
		},

		onDeleteClick: function(e) {
			e.preventDefault();
			this.$el.trigger('deleteClick', this.model);
		}
	});

});