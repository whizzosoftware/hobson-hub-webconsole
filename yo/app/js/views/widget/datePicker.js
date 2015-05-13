// Filename: views/widget/datePicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'moment',
	'i18n!nls/strings',
	'text!templates/datePicker.html'
], function($, _, Backbone, DateTimePicker, moment, strings, template) {

	var DatePickerView = Backbone.View.extend({
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

			var el = this.$el.find('input#date');

			this.$el.find('input#displayDate').datetimepicker({
				timepicker: false,
				format: 'm/d/Y',
				scrollInput: false,
				closeOnDateSelect: true,
				onChangeDateTime: function(dp, $input) {
					var time = moment($input.val(), 'MM/DD/YYYY');
					el.val(time.utc().format('YYYY-MM-DD'));
				}
			});

			return this;
		}

	});

	return DatePickerView;
});