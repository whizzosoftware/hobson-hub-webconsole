// Filename: views/settings/person.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'i18n!nls/strings',
	'text!templates/settings/person.html'
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
					person: this.model.toJSON()
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