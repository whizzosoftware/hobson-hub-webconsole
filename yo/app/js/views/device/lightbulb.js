// Filename: views/device/lightbulb.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'jquery-colpick',
	'services/colorConversion',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/switch.html'
], function($, _, Backbone, toastr, colpick, colorConversion, Variable, BaseStatus, strings, template) {

	return BaseStatus.extend({

		template: _.template(template),

		subviews: [],
		
		events: {
			'click #switchToggle': 'onClickOn',
			'change #levelSlider': 'onLevelChange',
			'change #colorSlider': 'onColorChange'
		},
		
		render: function(el) {
			var colorSliderVal;

			if (this.variables.color && this.variables.color.value) {
				var rgbs = this.variables.color.value.match(/\d+/g);
				colorSliderVal = colorConversion.convertRgbToByte(parseInt(rgbs[0]), parseInt(rgbs[1]), parseInt(rgbs[2]));
			}

			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON(),
				pending: this.showPending,
				variables: this.variables,
				colorSliderVal: colorSliderVal
			}));

			return this;
		},

		onVariableUpdate: function(name, value) {
			this.showSpinner(false, function() {
				this.render();
			}.bind(this));
		},

		onVariableUpdateTimeout: function(name) {
			toastr.error('Unable to confirm change with device.');
			this.showSpinner(false, function() {
				this.render();
			}.bind(this));
		},

		onVariableUpdateFailure: function() {
			toastr.error('An error occurred updating the device.');
			this.showSpinner(false, function() {
				this.render();
			}.bind(this));
		},

		onClickOn: function() {
			if (!this.hasPendingUpdates()) {
				var onVar = this.getVariable('on');
				this.showSpinner(true);
				this.setVariableValues({on: !onVar.value});
				this.disableAllControls();
			} else {
				return false;
			}
		},

		onColorChange: function(event) {
			var x = $(event.target).val();
			var color = colorConversion.convertByteToRgb(x);
			this.showSpinner(true);
			this.disableAllControls();
			this.setVariableValues({color: color});
		},

		onLevelChange: function(event) {
			if (!this.hasPendingUpdates()) {
				this.showSpinner(true);
				this.disableAllControls();
				this.setVariableValues({level: parseInt($(event.target).val())});
			} else {
				return false;
			}
		},

		disableAllControls: function() {
			var el = this.$el.find('#switchToggle');
			if (el) {
				el.addClass('disabled');
			}
			el = this.$el.find('#levelSlider');
			if (el) {
				$(el).prop('disabled', true);
			}
			el = this.$el.find('#colorSlider');
			if (el) {
				$(el).prop('disabled', true);
			}
		},

		showSpinner: function(show, callback) {
			if (show) {
				this.$el.find('#spinner').animate({'opacity': 1}, callback);
			} else {
				this.$el.find('#spinner').animate({'opacity': 0}, callback);
			}
		}

	});

});