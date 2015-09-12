// Filename: views/device/weatherStation.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/weatherStation.html'
], function($, _, Backbone, toastr, Variable, BaseStatusView, strings, template) {

	return BaseStatusView.extend({

		template: _.template(template),

		events: {
			'click #switchButton': 'onClick'
		},

		render: function(el) {
			var windDir = this.variables.windDirDeg.value;

			if (windDir) {
				windDir = Math.ceil(windDir/45.0) * 45.0;
			}

			this.$el.html(this.template({
				strings: strings,
				variables: this.variables,
				windDir: windDir
			}));

			return this;
		},

		onVariableUpdate: function(name, value) {
			this.render();
		}

	});

});