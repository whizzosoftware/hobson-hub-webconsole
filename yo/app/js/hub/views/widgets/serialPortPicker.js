// Filename: views/widgets/serialPortPicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/hub',
	'views/widgets/baseWidget',
	'i18n!nls/strings',
	'text!templates/widgets/serialPortPicker.html'
], function($, _, Backbone, HubService, BaseWidget, strings, template) {

	return BaseWidget.extend({
		template: _.template(template),

		events: {
			'change #serialPort': 'onSerialPortChange'
		},

		initialize: function(options) {
			this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
			this.value = options.value;
		},

		getValue: function() {
			return this.value;
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.model,
					required: this.required
				})
			);

			HubService.getHubSerialPorts(this, function(model, response, options) {
				var ports = options.context.$el.find('#serialPort');
				ports.html('');

				for (var ix=0; ix < model.length; ix++) {
					var sp = model.at(ix);
					var selected = sp.get('@id') === options.context.value;
					ports.append('<option ' + (selected ? 'selected' : '') + '>' + sp.get('@id') + '</option>');
					if (!options.context.value && ix == 0) {
						options.context.value = sp.get('@id');
					}
				}
				ports.prop('disabled', false);
			}, function() {
				toastr.error('An error occurred retrieving list of serial ports.');
			});

			return this;
		},

		onSerialPortChange: function(e) {
			this.value = e.target.value;
		}

	});

});