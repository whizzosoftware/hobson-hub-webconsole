// Filename: services/device.js
define([
	'jquery',
], function($) {
	var DeviceService = {

		setDeviceVariable: function(url, value) {
			return $.ajax(url, {
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify({value: value}),
				dataType: 'json'
			});
		}

	};

	return DeviceService;
});