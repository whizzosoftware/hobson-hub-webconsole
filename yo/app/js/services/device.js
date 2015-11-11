// Filename: services/device.js
define([
	'jquery',
	'models/session',
	'models/itemList',
	'models/device',
	'models/deviceBootstrap'
], function($, session, ItemList, Device, DeviceBootstrap) {
	var DeviceService = {

		createDevicesModel: function(expansions, sort) {
			var url = session.getSelectedHubDevicesUrl();
			if (expansions) {
				url += '?expand=' + expansions;
			}
			return new ItemList(null, {url: url, model: Device, sort: sort});
		},

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
			var bootstraps = new ItemList(null, {model: DeviceBootstrap, url: url, sort: 'deviceId'});
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