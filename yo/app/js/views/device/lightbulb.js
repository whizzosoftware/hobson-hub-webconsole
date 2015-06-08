// Filename: views/device/lightbulb.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/device/lightbulb.html'
], function($, _, Backbone, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		subviews: [],

		render: function(el) {
			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON()
			}));

			return this;
		}

	});

});