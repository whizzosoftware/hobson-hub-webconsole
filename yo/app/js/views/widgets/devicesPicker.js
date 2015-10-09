// Filename: views/widgets/datePicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'models/itemList',
	'models/device',
	'views/collection/devices',
	'i18n!nls/strings',
	'text!templates/widgets/devicesPicker.html'
], function($, _, Backbone, toastr, session, ItemList, Device, DevicesView, strings, template) {

	return Backbone.View.extend({
		template: _.template(template),

		className: 'device-picker',

		events: {
			'deviceClicked': 'onClickDevice'
		},

		initialize: function(options) {
			this.property = options.property;
			this.value = options.value;
			this.single = options.single;
			this.subviews = [];
			this.viewMap = {};

			// if single is true, treat as a single device object; if false, treat as an array of devices
			if (!this.value) {
				this.property.value = [];
			} else {
				this.property.value = [this.value];
			}
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					property: this.property
				})
			);

			var url = session.getSelectedHubDevicesUrl() + '?expand=item';
			if (this.property.constraints && this.property.constraints.deviceVariable) {
				url += '&var=' + this.property.constraints.deviceVariable;
			}

			var devices = new ItemList({model: Device, url: url, sort: 'name'});
			devices.fetch({
				context: this,
				success: function(model, response, options) {
					if (model.length > 0) {
						options.context.devicesView = new DevicesView({devices: model, value: options.context.property.value});
						options.context.$el.find('#deviceList').html(options.context.devicesView.render().el);
						options.context.subviews.push(options.context.devicesView);
						options.context.setDeviceCount(0);
					} else {
						options.context.$el.find('#deviceList').html(strings.NoDevicesAvailable);
					}
				},
				error: function(model, response, options) {
					toastr.error('Error retreiving list of devices.');
				}
			});

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
			var deviceId = options.device.get('@id');

			// change the property value
			if (this.isDeviceSelected(deviceId)) {
				for (var i=0; i < this.property.value.length; i++) {
					if (this.property.value[i]['@id'] === deviceId) {
						this.property.value.splice(i,1);
						break;
					}
				}
			} else {
				if (this.single) {
					console.debug('clearing property');
					this.property.value.splice(0, this.property.value.length);
				}
				this.property.value.push({'@id': deviceId, name: options.device.get('name')});
			}

			// re-render the view
			this.devicesView.render();

			// update device count selection text
			this.setDeviceCount(this.single ? (this.property.value ? 1 : 0) : this.property.value.length);
		},

		isDeviceSelected: function(deviceId) {
			for (var i=0; i < this.property.value.length; i++) {
				if (this.property.value[i]['@id'] === deviceId) {
					return true;
				}
			}
			return false;
		},

	    getId: function() {
			return this.property['@id'];
	    },

	    getValue: function() {
	    	if (this.single) {
				return this.property.value.length > 0 ? this.property.value[0] : null;
	    	} else {
	      		return this.property.value;
			}
	    }

	});

});
