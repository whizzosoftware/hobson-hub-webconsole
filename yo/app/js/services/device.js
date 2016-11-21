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

		addDevicePassport: function(context, deviceId) {
			var url = session.getSelectedHubDevicePassportsUrl();
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
        },

        isDeviceVariableValueEqual: function(v1, v2) {
        	// HSB color values can vary by a few integers due to the granularity of a given color device;
        	// we therefore compare the individual components of the colors allowing for slight variance
        	if (typeof v1 === 'string' && typeof v2 === 'string' && v1.startsWith('hsb(') && v2.startsWith('hsb(')) {
        		var a1 = v1.substring(4).split(',');
        		var a2 = v2.substring(4).split(',');
        		return (Math.abs(a1[0] - a2[0]) <= 5 && Math.abs(a2[1] - a2[1]) <= 5);
        	} else if (typeof v1 === 'string' && typeof v2 === 'string' && v1.startsWith('kb(') && v2.startsWith('kb(')) {
        		var a1 = v1.substring(3).split(',');
        		var a2 = v2.substring(3).split(',');
        		return Math.abs(a1[0] - a2[0]) <= 100 && a2[1] == a2[1];
        	// anything else should be a spot on match
        	} else {
	        	return (v1 === v2);
	        }
        }
	};

	return DeviceService;
});