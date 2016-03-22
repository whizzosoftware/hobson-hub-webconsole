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
			'change #colorSlider': 'onColorChange',
			'click #btnWarm': 'onColorTempChange',
			'click #btnNeutral': 'onColorTempChange',
			'click #btnCool': 'onColorTempChange'
		},
		
		render: function(el) {
			var colorSliderVal;
			var levelSliderVal;

			if (this.variables.color && this.variables.color.value) {
				var val = this.variables.color.value;
				if (val.substring(0, 4) === 'hsb(') {
					var vals = val.substring(4, val.indexOf(')')).split(',');
					colorSliderVal = vals[0];
					levelSliderVal = vals[2];
					this.color = {mode: 'hsb', value: parseInt(colorSliderVal)};
				} else if (val.substring(0,3) === 'kb(') {
					var vals = val.substring(3, val.indexOf(')')).split(',');
					colorSliderVal = 0;
					levelSliderVal = vals[1];
					this.color = {mode: 'kb', value: parseInt(vals[0])};
				}
			}
			if (!levelSliderVal && this.variables.level) {
				levelSliderVal = this.variables.level.value;
			}

			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON(),
				pending: this.showPending,
				variables: this.variables,
				color: this.color,
				levelSliderVal: levelSliderVal,
				colorSliderVal: colorSliderVal,
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
			var hue = $(event.target).val();
			this.showSpinner(true);
			this.disableAllControls();
			this.color = {mode: 'hsb', value: hue};
			this.setVariableValues({color: 'hsb(' + hue + ',100,' + $('#levelSlider').val() + ')'});
		},

		onLevelChange: function(event) {
			if (!this.hasPendingUpdates()) {
				this.showSpinner(true);
				this.disableAllControls();
				if (this.variables.color && this.color.mode === 'hsb') {
					this.setVariableValues({color: 'hsb(' + this.color.value + ',100,' + $(event.target).val() + ')'});
				} else if (this.variables.color && this.color.mode === 'kb') {
					this.setVariableValues({color: 'kb(' + this.color.value + ',' + $(event.target).val() + ')'});
				} else if (this.variables.level) {
					this.setVariableValues({level: $(event.target).val()});
				}
			} else {
				return false;
			}
		},

		onColorTempChange: function(event) {
			var t = $(event.target).attr('id');
			console.debug(t);
			this.showSpinner(true);
			this.disableAllControls();
			this.color = {mode: 'kb', value: 3500};
			if (t === 'btnWarm') {
				this.color.value = 2850;
			} else if (t === 'btnCool') {
				this.color.value = 4100;
			} else if (t !== 'btnNeutral') {
				console.debug('Unknown color temp set: ', t);
			}
			console.debug({color: 'kb(' + this.color.value + ',' + $('#levelSlider').val() + ')'});
			this.setVariableValues({color: 'kb(' + this.color.value + ',' + $('#levelSlider').val() + ')'});
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