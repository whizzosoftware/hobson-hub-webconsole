// Filename: services/taskDescription.js
define([
	'jquery',
	'underscore',
	'moment',
	'rrule',
	'nlp'
], function($, _, moment, RRule, nlp) {
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
						if (time.length > 2) {
							if (time.substring(2,3) == '+') {
								props[name] = 'after ' + props[name];
							} else if (time.substring(2,3) === '-') {
								props[name] = 'before ' + props[name];
							}
							if (time.length > 3) {
								props[name] = parseInt(time.substring(3,time.length)) + ' minutes ' + props[name];
							}
						}
					} else {
						props[name] = moment(time, 'HH:mm:ssZ').format('LT');
					}		
				} else if (name === 'date') {
					var date = moment(pc.properties[name]);
					props[name] = date.format('L');
				} else if (name === 'recurrence') {
					var s = pc.properties[name];
					if (s !== 'never') {
						var rrule = RRule.fromString(pc.properties[name]);
						props[name] = rrule.toText();
					} else {
						props[name] = s;
					}
				} else {
					props[name] = pc.properties[name];
				}
			}

			if (pc.descriptionTemplate) {
				return _.template(pc.descriptionTemplate.replace(new RegExp('\{', 'g'), '<%= ').replace(new RegExp('\}', 'g'), ' %>'))(props);
			} else {
				return '';
			}
		},

		createDeviceListDescription: function(devices) {
			if (devices && devices.length === 1) {
				return devices[0].name;
			} else if (devices && devices.length === 2) {
				return devices[0].name + ' or ' + devices[1].name;
			} else if (devices && devices.length > 2) {
				return devices[0].name + ' or ' + (devices.length - 1) + ' other devices';
			} else {
				return 'No devices chosen';
			}
		}

	};
});