// Filename: views/device/thermostat.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/thermostat.html'
], function($, _, Backbone, toastr, BaseStatus, strings, template) {

	return BaseStatus.extend({

		template: _.template(template),

		events: {
			"click .button": "onClick"
		},

		render: function(el) {
			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON(),
				variables: this.variables
			}));

			return this;
		},

		onClick: function(event) {
			event.preventDefault();

			var el = $(event.currentTarget);

			if (!el.hasClass('disabled') && !el.hasClass('active')) {
				el.html('<i class="fa fa-spinner fa-spin"></i>');
				this.disableAllButtons();

				switch (event.currentTarget.id) {
					case 'mode-off':
						this.setVariableValues({tstatMode: 'OFF'});
						break;
					case 'mode-cool':
						this.setVariableValues({tstatMode: 'COOL'});
						break;
					case 'mode-heat':
						this.setVariableValues({tstatMode: 'HEAT'});
						break;
					case 'mode-auto':
						this.setVariableValues({tstatMode: 'AUTO'});
						break;
					case 'fan-auto':
						this.setVariableValues({tstatFanMode: 'AUTO'});
						break;
					case 'fan-on':
						this.setVariableValues({tstatFanMode: 'ON'});
						break;
					case 'up':
						this.sendTempAdjustCommand(1);
						break;
					case 'down':
						this.sendTempAdjustCommand(-1);
						break;
				}
			}
		},

		onVariableUpdate: function(name, value) {
			this.render();
		},

		onVariableUpdateTimeout: function(name) {
			toastr.error('Unable to confirm change with device.');
			this.render();
		},

		onVariableUpdateFailure: function() {
			toastr.error('An error occurred updating the device.');
			this.render();
		},

		disableAllButtons: function() {
			this.$el.find('.button').each(function() {
				$(this).addClass('disabled');
			});
		},

		sendTempAdjustCommand: function(offset) {
			if (this.variables['targetCoolTempF']) {
				switch (this.variables['tstatMode'].value) {
					case 'COOL':
						this.setVariableValues({targetCoolTempF: this.variables['targetCoolTempF'].value + offset});
						break;
					case 'HEAT':
						this.setVariableValues({targetHeatTempF: this.variables['targetHeatTempF'].value + offset});
						break;
					case 'AUTO':
						this.setVariableValues({
							targetCoolTempF: this.variables['targetCoolTempF'].value + offset,
							targetHeatTempF: this.variables['targetHeatTempF'].value + offset
						});
						break;
				}
			} else if (this.variables['targetTempF']) {
				this.setVariableValues({targetTempF: this.variables['targetTempF'].value + offset});
			}
		}
	});

});