// Filename: models/presenceLocation.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({

		url: function() {
			return this.get('url');
		},

		validation: {
			name: {
				required: true
			},
			latitude: {
				required: function(value, attr, computedState) {
					return computedState.type === 'map';
				}
			},
			longitude: {
				required: function(value, attr, computedState) {
					return computedState.type === 'map';
				}
			},
			radius: {
				required: function(value, attr, computedState) {
					return computedState.type === 'map';
				}
			},
			beaconMajor: {
				required: function(value, attr, computedState) {
					return computedState.type === 'beacon';
				}
			},
			beaconMinor: {
				required: function(value, attr, computedState) {
					return computedState.type === 'beacon';
				}
			}
		},

		isBeacon: function() {
			return this.get('beaconMajor') && this.get('beaconMinor');
		},

		isMap: function() {
			return this.get('latitude') && this.get('longitude') && this.get('radius');
		},

		toJSON: function() {
			var ret = {};
			for (var s in this.validation) {
				if (this.get(s)) {
					ret[s] = this.get(s);
				}
			}
			return ret;
		}

	});
});