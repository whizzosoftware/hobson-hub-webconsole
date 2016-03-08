// Filename: views/data/variableSelectorsPanel
define([
	'jquery',
	'underscore',
	'backbone',
	'views/widgets/devicesPicker',
	'views/widgets/variablePicker',
	'i18n!nls/strings',
	'text!templates/data/variableSelectorsPanel.html'
], function($, _, Backbone, DevicesPickerView, VariablePickerView, strings, template) {

	return Backbone.View.extend({
		template: _.template(template),

		tagName: 'ul',

		className: "accordion",

		attributes: {
			'data-accordion': ''
		},

		events: {
			'deviceSelected': 'onDeviceSelected',
			'deviceDeselected': 'onDeviceDeselected',
			'click #buttonAdd': 'onClickAdd'
		},

		initialize: function(options) {
			this.devices = options.devices;
			this.model = {
				name: '',
				variables: []
			};
		},

		remove: function() {
			this.devicesPicker.remove();
			this.variablePicker.remove();
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings
				})
			);

			this.devicesPicker = new DevicesPickerView({
				model: {
					name: 'Device'
				},
				required: true,
				single: true,
				showDescription: false
			});
			this.$el.find('#deviceSelector').html(this.devicesPicker.render().el);

			this.variablePicker = new VariablePickerView({
				single: false
			});
			this.$el.find('#variableSelector').html(this.variablePicker.render().el);

			return this;
		},

		onDeviceSelected: function(evt, device) {
			this.variablePicker.setDevice(device);
		},

		onDeviceDeselected: function(evt, device) {
			this.variablePicker.setDevice(null);
		},

		onClickAdd: function(evt) {
			for (var ix in this.variablePicker.model.value) {
				this.model.variables.push(this.variablePicker.model.value[ix]);
			}
			this.$el.trigger('addVariable', this.variablePicker.model);
		}

	});

});