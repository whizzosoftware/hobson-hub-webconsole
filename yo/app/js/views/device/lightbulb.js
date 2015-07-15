// Filename: views/device/lightbulb.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'jquery-colpick',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/lightbulb.html'
], function($, _, Backbone, toastr, colpick, Variable, BaseStatus, strings, template) {

	return BaseStatus.extend({

		template: _.template(template),

		subviews: [],
		
		events: {
			'click #switchButton': 'onClickOn',
			'change #levelSlider': 'onLevelChange'
		},
		
		render: function(el) {

			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON(),
				pending: this.showPending,
				variables: this.variables
			}));

			// create color picker
			var colVal = this.getVariable('color');
			if (colVal) {
				this.$el.find('#colorPicker').colpick({
					layout: 'hex',
					color: colVal.value.substring(1),
					onSubmit: function(hsb,hex,rgb,el,bySetColor) {
						this.onColorChange(hsb,hex,rgb,el,bySetColor);
					}.bind(this)
				});
			}

			return this;
		},

		onVariableUpdate: function(name, value) {
			toastr.success('Command sent to device.');
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

		onClickOn: function() {
			var el = this.$el.find('#switchButton');
			if (el && !el.hasClass('disabled')) {
				var onVar = this.getVariable('on');
				el.html('<i style="font-size: 4em;" class="fa fa-spinner fa-spin"></i>');
				this.setVariableValues({on: !onVar.value});
				this.disableAllControls();
			}
		},

		onColorChange: function(hsb,hex,rgb,el,bySetColor) {
			var el = this.$el.find('#colorPicker');
			if (el && !el.hasClass('disabled')) {
				var color = 'rgb(' + rgb.r + "," + rgb.g + "," + rgb.b + ")";
				el.val(color);
				el.css('background-color', color);
				el.colpickHide();
				this.setVariableValues({color: color});
			}
		},

		onLevelChange: function(event) {
			this.setVariableValues({level: $(event.target).val()});
			this.disableAllControls();
		},

		disableAllControls: function() {
			var el = this.$el.find('#switchButton');
			if (el) {
				el.addClass('disabled');
			}
			el = this.$el.find('#levelSlider');
			if (el) {
				console.debug(el);
				$(el).prop('disabled', true);
			}
			el = this.$el.find('#colorPicker');
			if (el) {
				$(el).prop('disabled', true);
			}
		}

	});

});