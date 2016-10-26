// Filename: views/widgets/colorPicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jquery-colpick',
	'moment',
	'views/widgets/baseWidget',
	'i18n!nls/strings',
	'text!templates/widgets/colorPicker.html'
], function($, _, Backbone, DateTimePicker, moment, BaseWidget, strings, template) {

	return BaseWidget.extend({
		template: _.template(template),

		initialize: function(options) {
			this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.model,
					id: this.getSafeId(),
					required: this.required
				})
			);

			this.model.value = 'rgb(0,0,0)';

			// create color picker
			this.$el.find('#colorView').colpick({
				layout: 'hex',
				color: 'rgb(0,0,0)',
				onSubmit: function(hsb, hex, rgb, el, bySetColor) {
					this.onColorChange('rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
				}.bind(this)
			});

			return this;
		},

		getValue: function() {
			return this.$el.find('input#' + this.getSafeId()).val();
		},

		onColorChange: function(color) {
			var el = this.$el.find('#colorView');
			if (el) {
				this.$el.find('#color').val(color);
				el.css('background-color', color);
				el.colpickHide();
			}
		}

	});

});