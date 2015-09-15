// Filename: views/widgets/colorPicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jquery-colpick',
	'moment',
	'i18n!nls/strings',
	'text!templates/widgets/colorPicker.html'
], function($, _, Backbone, DateTimePicker, moment, strings, template) {

	return Backbone.View.extend({
		template: _.template(template),

		initialize: function(property) {
			this.property = property;
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.property
				})
			);

			this.property.value = 'rgb(255,0,0)';

			// create color picker
			this.$el.find('#colorView').colpick({
				layout: 'hex',
				color: 'rgb(255,0,0)',
				onSubmit: function(hsb, hex, rgb, el, bySetColor) {
					this.onColorChange('rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
				}.bind(this)
			});

			return this;
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