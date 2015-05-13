// Filename: collections/devices.js
define([
	'backbone',
	'models/device'
], function(Backbone, DeviceModel) {
	var DeviceCollection = Backbone.Collection.extend({

		model: DeviceModel,

		initialize: function(options) {
			this.url = options.url + '?details=true';
		},

		getDevice: function(pluginId, deviceId) {
			for (var i=0; i < this.models.length; i++) {
				var model = this.models[i];
				if (pluginId === model.get('pluginId') && deviceId === model.get('id')) {
					return model;
				}
			}
			return null;
		}
	});

	return DeviceCollection;
});