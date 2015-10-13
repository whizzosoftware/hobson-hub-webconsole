// Filename: views/widgets/timepicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'moment',
	'views/widgets/baseWidget',
	'i18n!nls/strings',
	'text!templates/widgets/timePicker.html'
], function($, _, Backbone, DateTimePicker, moment, BaseWidget, strings, template) {

	return BaseWidget.extend({
		template: _.template(template),

		events: {
			'change input[type=radio]': 'onChangeTimeType',
			'change #offsetSeconds': 'onChangeOffsetSeconds',
			'change #offsetMult': 'onChangeOffsetMult'
		},

		initialize: function(options) {
			this.showSun = options.showSun;
			this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.model,
					id: this.getSafeId(),
					required: this.required,
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

   		showError: function(showError) {
			BaseWidget.prototype.showError.call(this, showError);
			if (showError) {
				this.$el.find('#displayTime').addClass('error');
			} else {
				this.$el.find('#displayTime').removeClass('error');
			}
		},

		onChangeTimeType: function(event) {
			var val = $(event.target).val();
			switch (val) {
				case 'absolute':
					this.$el.find('#timeAbsolutePanel').css('display', 'block');
					this.$el.find('#timeRelativePanel').css('display', 'none');
					this.$el.find('.description').html(strings.TaskExactTOD);
					break;
				case 'sunrise':
				case 'sunset':
					this.$el.find('#timeAbsolutePanel').css('display', 'none');
					this.$el.find('#timeRelativePanel').css('display', 'block');
					this.$el.find('.description').html(strings.TaskRelativeTOD);
					break;
			}
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