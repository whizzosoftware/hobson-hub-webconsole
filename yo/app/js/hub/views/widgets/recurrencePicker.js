// Filename: views/widgets/recurrencePicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'moment',
	'views/widgets/baseWidget',
	'models/recurrenceDefaults',
	'i18n!nls/strings',
	'text!templates/widgets/recurrencePicker.html'
], function($, _, Backbone, DateTimePicker, moment, BaseWidget, RecurrenceDefaults, strings, template) {

	return BaseWidget.extend({

		template: _.template(template),

		events: {
			'change #recurrenceSelect': 'onChangeRecurrence',
			'change #end': 'onChangeEndDate',
			'change input[type=checkbox]': 'onChangeDaySelect'
		},

		initialize: function(options) {
			this.defaults = new RecurrenceDefaults();
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.model,
					defaults: this.defaults.get('values')
				})
			);

			this.$el.find('#end').datetimepicker({
				timepicker: false,
				format: 'm/d/Y',
				scrollInput: false,
				closeOnDateSelect: true
			});

			return this;
		},

		getValue: function() {
			return this.$el.find('input#' + this.getSafeId()).val();
		},

		showDaySelector: function(visible) {
			this.$el.find('#daySelector').css('display', visible ? 'block' : 'none');
			if (!visible) {
				this.$el.find('input[type=checkbox]').attr('checked', false);
			}
		},

		createICalDateString: function(str) {
			var date = moment(str, 'MM/DD/YYYY');
			return date.format('YYYYMMDD');
		},

		createRecurrenceString: function() {
			var r = this.$el.find('#recurrenceSelect').val();

			// if an end date is set, append it
			var end = this.$el.find('#end').val();
			if (end) {
				r += ';UNTIL=' + this.createICalDateString(end, false);
			}

			// iterate through all checkboxes and append the days that are checked
			var byday = ';BYDAY=';
			var els = this.$el.find('input[type=checkbox]');
			for (var i=0; i < els.length; i++) {
				var el = $(els[i]);
				if (el.is(':checked')) {
					byday += el.attr('id') + ',';
				}
			}

			// if any days were checked, append them to the recurrence string
			if (byday.length > 7) {
				// remove trailing comma if present
				if (byday.charAt(byday.length-1) == ',') {
					byday = byday.substring(0, byday.length - 1);
				}
				r += byday;
			}

			return r;
		},

		onChangeRecurrence: function(event) {
			var val = $(event.target).val();
			this.showDaySelector(val.indexOf('WEEKLY') > -1);
			this.$el.find('#endSelector').css('display', (val === '' || val === 'never') ? 'none' : 'block');
			this.$el.find('#recurrence').val(this.createRecurrenceString());
		},

		onChangeDaySelect: function(event) {
			this.$el.find('#recurrence').val(this.createRecurrenceString());
		},

		onChangeEndDate: function(event) {
			this.$el.find('#recurrence').val(this.createRecurrenceString());
		}

	});

});