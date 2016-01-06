// Filename: services/device.js
define([
	'jquery',
	'moment',
	'models/session',
	'models/itemList',
	'models/device',
	'models/devicePassport'
], function($, moment, session, ItemList, Device, DevicePassport) {
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

		getDevicePassports: function(context, url, success, error) {
			var passports = new ItemList(null, {model: DevicePassport, url: url, sort: 'deviceId'});
			passports.fetch({
				context: this,
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