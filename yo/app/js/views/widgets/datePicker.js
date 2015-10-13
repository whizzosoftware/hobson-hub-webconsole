// Filename: views/widgets/datePicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'moment',
	'views/widgets/baseWidget',
	'i18n!nls/strings',
	'text!templates/widgets/datePicker.html'
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
					required: this.required
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
		},

   		showError: function(showError) {
			BaseWidget.prototype.showError.call(this, showError);
			if (showError) {
				this.$el.find('#displayDate').addClass('error');
			} else {
				this.$el.find('#displayDate').removeClass('error');
			}
		}

	});

});