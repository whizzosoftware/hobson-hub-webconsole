// Filename: views/device/thermostat.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/thermostat.html'
], function($, _, Backbone, BaseStatus, strings, template) {

	return BaseStatus.extend({

		template: _.template(template),

		render: function(el) {
			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON(),
				variables: this.variables
			}));

			return this;
		}

	});

});