// Filename: services/device.js
define([
	'jquery',
	'models/itemList',
	'models/deviceBootstrap'
], function($, ItemList, DeviceBootstrap) {
	var DeviceService = {

		setDeviceVariable: function(url, value) {
			return $.ajax(url, {
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify({value: value}),
				dataType: 'json'
			});
		},

		setDeviceVariables: function(context, url, values) {
			return $.ajax(url, {
				context: context,
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify({values: values}),
				dataType: 'json'
			});
		},

		getDeviceBootstraps: function(context, url, success, error) {
			var bootstraps = new ItemList({model: DeviceBootstrap, url: url, sort: 'deviceId'});
			bootstraps.fetch({
				context: this,
				success: success,
				error: error
			});
		},

		addDeviceBootstrap: function(context, url, deviceId) {
			return $.ajax(url, {
				context: context,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({deviceId: deviceId}),
				dataType: 'json'
			});
		},

		resetDeviceBootstrap: function(context, url) {
			return $.ajax(url, {
				context: context,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({}),
				dataType: 'json'
			});
		},

		deleteDeviceBootstrap: function(context, url) {
			return $.ajax(url, {
				context: context,
				type: 'DELETE',
				contentType: 'application/json',
				dataType: 'json'
			});
		}

	};

	return DeviceService;
});