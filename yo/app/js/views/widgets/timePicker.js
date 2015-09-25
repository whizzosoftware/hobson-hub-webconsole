// Filename: views/widgets/timepicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'moment',
	'i18n!nls/strings',
	'text!templates/widgets/timePicker.html'
], function($, _, Backbone, DateTimePicker, moment, strings, template) {

	return Backbone.View.extend({
		template: _.template(template),

		events: {
			'change input[type=radio]': 'onChangeTimeType',
			'change #offsetSeconds': 'onChangeOffsetSeconds',
			'change #offsetMult': 'onChangeOffsetMult'
		},

		initialize: function(options) {
			this.showSun = options.showSun;
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.model,
					showSun: this.showSun
				})
			);

			var context = this;

			this.$el.find('input#displayTime').datetimepicker({
				datepicker: false,
				format: 'H:i',
				hours12: false,
				step: 10,
				onChangeDateTime: function(dp, $input) {
					context.updateTime(context.$el);
				}
			});

			return this;
		},

		updateTime: function(el) {
			var timeEl = el.find('input#time');
			if (el.find('#timeAbsolute').prop('checked')) {
				var s = el.find('input#displayTime').val();
				if (s && s.length > 0) {
					var time = moment(s, 'HH:mm')
					timeEl.val(time.utc().format('HH:mm:ss') + 'Z');
				} else {
					timeEl.val('');
				}
			} else {
				var sr = el.find('#timeSunrise').prop('checked');
				var ss = el.find('#timeSunset').prop('checked');
				if (ss || sr) {
					var s = sr ? 'SR' : 'SS';
					var i = parseInt(el.find('#offsetSeconds').val());
					var m = el.find('#offsetMult').val() === 'before' ? '-' : '+';
					if (i > 0) {
						timeEl.val(s + m + i);
					} else {
						timeEl.val(s);
					}
				}
			}
		},

		onChangeTimeType: function(event) {
			var val = $(event.target).val();
			$('#timeAbsolutePanel').css('display', (val === 'absolute') ? 'block' : 'none');
			$('#timeRelativePanel').css('display', (val === 'sunrise' || val === 'sunset') ? 'block' : 'none');
			this.updateTime(this.$el);
		},

		onChangeOffsetSeconds: function(event) {
			this.updateTime(this.$el);
		},

		onChangeOffsetMult: function(event) {
			this.updateTime(this.$el);
		}

	});

});