// Filename: views/device/lightbulb.js
define([
	'jquery',
	'underscore',
	'backbone',
	'foundation.core',
	'jquery-colpick',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/lightbulb.html'
], function($, _, Backbone, foundation, colpick, Variable, BaseStatus, strings, template) {

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

			$(document).foundation('slider', 'reflow');

			return this;
		},

		onClickOn: function() {
			if (!this.showPending) {
				var onVar = this.getVariable('on');
				this.setVariableValue('on', !onVar.value);
			}
		},

		onColorChange: function(hsb,hex,rgb,el,bySetColor) {
			if (!this.showPending) {
				var color = '#' + hex;
				$(el).val(color);
				$(el).css('background-color', color);
				$(el).colpickHide();
				this.setVariableValue('color', color);
			}
		},

		onLevelChange: function(event) {
			if (!this.showPending) {
				this.setVariableValue('level', $(event.target).val());
			}
		}

	});

});