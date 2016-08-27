// Filename: views/widgets/timepicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'jquery-timepicker',
	'moment',
	'views/widgets/baseWidget',
	'i18n!nls/strings',
	'text!templates/widgets/timePicker.html'
], function($, _, Backbone, TimePicker, moment, BaseWidget, strings, template) {

	return BaseWidget.extend({
		template: _.template(template),

		events: {
			'change input[type=radio]': 'onChangeTimeType',
			'change #offsetSeconds': 'onChangeOffsetSeconds',
			'change #offsetMult': 'onChangeOffsetMult'
		},

		// option mode = 0 (include sun chooser), 1 (disable sun chooser), 2 (hide sun chooser)

		initialize: function(options) {
			_.bindAll(this, 'onTimeChange');
			this.mode = options.mode ? options.mode : 0;
			this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
			this.value = options.value;
		},

		render: function() {
			this.$el.append(
				this.template({
					mode: this.mode,
					strings: strings,
					property: this.model,
					id: this.getSafeId(),
					required: this.required,
				})
			);

			var context = this;

			var el = this.$el.find('input#displayTime');

			el.timepicker({
				step: 10,
				scrollDefault: 'now'
			}).on('change', this.onTimeChange);

			if (this.value) {
				el.timepicker('setTime', moment(this.value, 'HH:mm:ssZ').toDate());
			}

			return this;
		},

		onTimeChange: function(event) {
			this.onUpdateTime($(event.target));
		},

		getValue: function() {
			return this.value;
		},

		onUpdateTime: function(timeEl) {
			if (this.mode == 2 || this.$el.find('#timeAbsolute').prop('checked')) {
				var s = this.$el.find('input#displayTime').val();
				if (s && s.length > 0) {
					var time = moment(s, 'HH:mma')
					this.value = time.utc().format('HH:mm:ss') + 'Z';
				} else {
					this.value = '';
				}
			} else if (this.mode < 2) {
				var sr = this.$el.find('#timeSunrise').prop('checked');
				var ss = this.$el.find('#timeSunset').prop('checked');
				if (ss || sr) {
					var s = sr ? 'SR' : 'SS';
					var i = parseInt(this.$el.find('#offsetSeconds').val());
					var m = this.$el.find('#offsetMult').val() === 'before' ? '-' : '+';
					if (i > 0) {
						this.value = s + m + i;
					} else {
						this.value = s;
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
			this.onUpdateTime($(event.target));
		},

		onChangeOffsetSeconds: function(event) {
			this.onUpdateTime($(event.target));
		},

		onChangeOffsetMult: function(event) {
			this.onUpdateTime($(event.target));
		}

	});

});