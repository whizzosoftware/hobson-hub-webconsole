// Filename: views/device/thermostat.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/device/thermostat.html'
], function($, _, Backbone, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		render: function(el) {
			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON()
			}));

			return this;
		}

	});

});