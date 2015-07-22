// Filename: views/device/sensor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/sensor.html'
], function($, _, Backbone, toastr, Variable, BaseStatusView, strings, template) {

	return BaseStatusView.extend({

		template: _.template(template),

		events: {
			'click #switchButton': 'onClick'
		},

		render: function(el) {
			console.debug(this.model.toJSON());

			this.$el.html(this.template({
				strings: strings,
				variables: this.variables
			}));

			return this;
		},

		onVariableUpdate: function(name, value) {
			this.render();
		}

	});

});