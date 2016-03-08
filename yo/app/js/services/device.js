// Filename: services/device.js
define([
	'jquery',
	'moment',
	'models/session',
	'models/itemList',
	'models/device',
	'models/devicePassport',
	'models/variable'
], function($, moment, session, ItemList, Device, DevicePassport, Variable) {
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

		getDevices: function(context, success, error) {
			var devices = new ItemList(null, {
				model: Device,
				url: session.getSelectedHubDevicesUrl() + '?expand=item'
			});

			devices.fetch({
				context: context,
				success: success,
				error: error
			});
		},

		getDevicePassports: function(context, url, success, error) {
			var passports = new ItemList(null, {model: DevicePassport, url: url + '?expand=item', sort: 'deviceId'});
			passports.fetch({
				context: context,
				success: success,
				error: error
			});
		},

		getDeviceVariables: function(context, url, success, error) {
			var variables = new ItemList(null, {model: Variable, url: url + '?expand=item'});
			variables.fetch({
				context: context,
				success: success,
				error: error
			});
		},

		addDevicePassport: function(context, url, deviceId) {
			return $.ajax(url, {
				context: context,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({deviceId: deviceId}),
				dataType: 'json'
			});
		},

		resetDevicePassport: function(context, url) {
			return $.ajax(url, {
				context: context,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({}),
				dataType: 'json'
			});
		},

		deleteDevicePassport: function(context, url) {
			return $.ajax(url, {
				context: context,
				type: 'DELETE',
				contentType: 'application/json',
				dataType: 'json'
			});
		},

		isDeviceAvailable: function(device) {
            return device.get('available');
        }
	};

	return DeviceService;
});