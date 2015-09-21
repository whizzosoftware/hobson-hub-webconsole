// Filename: views/settings/deviceBootstrap.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'i18n!nls/strings',
	'text!templates/settings/deviceBootstrap.html'
], function($, _, Backbone, moment, strings, template) {

	return Backbone.View.extend({

		tagName: 'tr',

		template: _.template(template),

		events: {
			'click #resetButton': 'onResetClick',
			'click #deleteButton': 'onDeleteClick'
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					moment: moment,
					bootstrap: this.model.toJSON()
				})
			);

			return this;
		},

		onResetClick: function(e) {
			e.preventDefault();
			this.$el.trigger('resetClick', this.model);
		},

		onDeleteClick: function(e) {
			e.preventDefault();
			this.$el.trigger('deleteClick', this.model);
		}
	});

});