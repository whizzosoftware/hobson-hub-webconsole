// Filename: views/widgets/datePicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'models/devices',
	'views/collection/devices',
	'i18n!nls/strings',
	'text!templates/widgets/devicesPicker.html'
], function($, _, Backbone, session, Devices, DevicesView, strings, template) {

	return Backbone.View.extend({
		template: _.template(template),

		className: 'device-picker',

		events: {
			'deviceSelected': 'onDeviceSelected'
		},

		initialize: function(property) {
			this.property = property;
			this.property.value = [];
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.property
				})
			);

			var devices = new Devices({url: session.getSelectedHubDevicesUrl()});
			devices.fetch({
				context: this,
				success: function(model, response, options) {
					console.debug('got device list: ', model);
					options.context.devicesView = new DevicesView({devices: model});
					options.context.$el.find('#deviceList').html(options.context.devicesView.render().el);
				},
				error: function(model, response, options) {
					console.debug('nope!');
				}
			})

			this.setDeviceCount(0);

			return this;
		},

		setDeviceCount: function(count) {
			if (count === 0) {
				this.$el.find('#deviceCount').html(strings.NoDevicesSelected);
			} else if (count === 1) {
				this.$el.find('#deviceCount').html('1 ' + strings.DeviceSelected);
			} else if (count > 1) {
				this.$el.find('#deviceCount').html(count + ' ' + strings.DevicesSelected);
			}
		},

		onDeviceSelected: function(event, options) {
			console.debug('Device selected: ', options.device.get('name'), options.selected);
			var pluginId = options.device.get('pluginId');
			var deviceId = options.device.get('id');
			if (options.selected) {
				this.property.value.push({pluginId: pluginId, deviceId: deviceId, name: options.device.get('name')});
			} else {
				for (var i=0; i < this.property.value.length; i++) {
					if (this.property.value[i].pluginId === pluginId && this.property.value[i].deviceId === deviceId) {
						this.property.value.splice(i, 1);
						break;
					}
				}
			}
			this.setDeviceCount(this.property.value.length);
		}

	});

});