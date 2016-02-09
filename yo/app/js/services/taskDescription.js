// Filename: services/taskDescription.js
define([
	'jquery',
	'underscore',
	'moment',
	'rrule',
	'nlp'
], function($, _, moment, RRule, nlp) {
	return {
		createDescription: function(pcc, pc, devices) {
			if (pc && pc.cclass) {
				var cclass = pc.cclass['@id'];
				var props = {};
				var descriptionTemplate = pcc.descriptionTemplate;

				for (name in pc.values) {
					if (name === 'devices') {
						props[name] = this.createDeviceListDescription(pc.values[name], devices);
					} else if (name === 'time') {
						var time = pc.values[name];
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
						var date = moment(pc.values[name]);
						props[name] = date.format('L');
					} else if (name === 'recurrence') {
						var s = pc.values[name];
						if (s !== 'never') {
							var rrule = RRule.fromString(pc.values[name]);
							props[name] = rrule.toText();
						} else {
							props[name] = s;
						}
					} else if (name === 'person' || name === 'location') {
						props[name] = pc.values[name].name;
					} else {
						props[name] = pc.values[name];
					}
				}
			}

			if (descriptionTemplate) {
				return _.template(descriptionTemplate.replace(new RegExp('\{', 'g'), '<%= ').replace(new RegExp('\}', 'g'), ' %>'))(props);
			} else {
				return '';
			}
		},

		createDeviceListDescription: function(prop, devices) {
			if (prop && prop.length === 1) {
				return this.getDeviceName(prop[0]['@id'], devices);
			} else if (prop && prop.length === 2) {
				return this.getDeviceName(prop[0]['@id'], devices) + ' or ' + this.getDeviceName(prop[1]['@id'], devices);
			} else if (prop && prop.length > 2) {
				return this.getDeviceName(prop[0]['@id'], devices) + ' or ' + (prop.length - 1) + ' other devices';
			} else {
				return 'No devices chosen';
			}
		},

		getDeviceName: function(id, deviceList) {
			for (var i=0; i < deviceList.length; i++) {
				if (deviceList[i]['@id'] == id) {
					return deviceList[i]['name'];
				}
			}
		}

	};
});