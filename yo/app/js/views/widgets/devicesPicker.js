// Filename: views/widgets/datePicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'models/itemList',
	'models/device',
	'views/collection/devices',
	'i18n!nls/strings',
	'text!templates/widgets/devicesPicker.html'
], function($, _, Backbone, session, ItemList, Device, DevicesView, strings, template) {

	return Backbone.View.extend({
		template: _.template(template),

		className: 'device-picker',

		elMap: {},

		events: {
			'deviceClicked': 'onClickDevice'
		},

		initialize: function(property, single) {
			this.property = property;
			this.single = single;

			// if single is true, treat as a single device object; if false, treat as an array of devices
			if (!this.single) {
				this.property.value = [];
			}
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.property
				})
			);

			var devices = new ItemList({model: Device, url: session.getSelectedHubDevicesUrl() + '?expand=item', sort: 'name'});
			devices.fetch({
				context: this,
				success: function(model, response, options) {
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
				this.$el.find('#deviceCount').html(this.single ? strings.NoDevicesSelectedSingle : strings.NoDevicesSelectedMultiple);
			} else if (count === 1) {
				this.$el.find('#deviceCount').html('1 ' + strings.DeviceSelected);
			} else if (count > 1) {
				this.$el.find('#deviceCount').html(count + ' ' + strings.DevicesSelected);
			}
		},

		onClickDevice: function(event, options) {
			console.debug('Device selected: ', options.device.get('name'));
			var deviceId = options.device.get('@id');

			// update selected device or list of selected devices
			if (this.isDeviceSelected(deviceId)) {
				if (this.single) {
					if (this.property.value && this.property.value['@id'] === deviceId) {
						this.removeActiveEl(deviceId);
						this.property.value = null;
					}
				} else {
					for (var i=0; i < this.property.value.length; i++) {
						if (this.property.value[i]['@id'] === deviceId) {
							this.removeActiveEl(deviceId);
							this.property.value.splice(i, 1);
							break;
						}
					}
				}
			} else {
				var d = {'@id': deviceId, name: options.device.get('name')};
				if (this.single) {
					if (this.property.value) {
						this.removeActiveEl(this.property.value['@id']);
					}
					this.property.value = d;
				} else {
					this.property.value.push(d);
				}
				this.addActiveEl(deviceId, options.el);
			}

			// update device count selection text
			this.setDeviceCount(this.single ? (this.property.value ? 1 : 0) : this.property.value.length);
		},

		isDeviceSelected: function(deviceId) {
			if (this.single) {
				return (this.property.value && this.property.value.deviceId === deviceId);
			} else {
				for (var i=0; i < this.property.value.length; i++) {
					if (this.property.value[i].deviceId === deviceId) {
						return true;
					}
				}
				return false;
			}
		},

		addActiveEl: function(deviceId, el) {
			this.elMap[deviceId] = el;
			el.addClass('active');
		},

		removeActiveEl: function(deviceId) {
			var el = this.elMap[deviceId];
			if (el) {
				el.removeClass('active');
			}
		}

	});

});