// Filename: views/device/sensorTile.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/sensorTile.html'
], function($, _, Backbone, toastr, Variable, BaseStatusView, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		template: _.template(template),

		render: function(el) {
			console.debug('model: ', this.model);
			this.$el.html(this.template({
				model: this.model,
				strings: strings
			}));
			return this;
		}

	});

});