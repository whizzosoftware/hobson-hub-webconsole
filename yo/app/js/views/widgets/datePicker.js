// Filename: views/widgets/datePicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'moment',
	'i18n!nls/strings',
	'text!templates/widgets/datePicker.html'
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
					var now = moment();
					var time = moment($input.val(), 'MM/DD/YYYY');

					// set the hour/minute/second in case GMT offset pushes us into tomorrow
					time.hour(now.hour());
					time.minute(now.minute());
					time.seconds(now.seconds());

					el.val(time.utc().format('YYYY-MM-DD'));
				}
			});

			return this;
		}

	});

	return DatePickerView;
});