// Filename: services/taskDescription.js
define([
	'jquery',
	'underscore',
	'moment'
], function($, _, moment) {
	return {

		createDescription: function(pc) {
			var cclass = pc.id;
			var props = {};

			for (name in pc.properties) {
				if (name === 'devices') {
					props[name] = this.createDeviceListDescription(pc.properties[name]);
				} else if (name === 'time') {
					var time = pc.properties[name];
					if (time.charAt(0) === 'S') {
						props[name] = time.substring(0,2) === 'SR' ? 'sunrise' : 'sunset';
					} else {
						props[name] = moment(time, 'HH:mm:ssZ').format('LT');
					}		
				} else if (name === 'date') {
					var date = moment(pc.properties[name]);
					props[name] = date.format('L');
				} else {
					props[name] = pc.properties[name];
				}
			}

			var ct = _.template(pc.descriptionTemplate.replace(new RegExp('\{', 'g'), '<%= ').replace(new RegExp('\}', 'g'), ' %>'));
			return ct(props);
		},

		createDeviceListDescription: function(devices) {
			if (devices.length === 1) {
				return devices[0].name;
			} else if (devices.length === 2) {
				return devices[0].name + ' or ' + devices[1].name;
			} else if (devices.length > 2) {
				return devices[0].name + ' or ' + (devices.length - 1) + ' other devices';
			}
		}

	};
});