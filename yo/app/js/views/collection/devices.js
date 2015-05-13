// Filename: views/collection/devices.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/collection/device',
	'i18n!nls/strings'
], function($, _, Backbone, DeviceView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		subviews: [],

		initialize: function(options) {
			this.devices = options.devices;
		},

		render: function() {
			console.debug('rendering devices: ', this.devices);
			for (var i=0; i < this.devices.length; i++) {
				var device = this.devices.at(i);
				console.debug('device: ', device);
				var v = new DeviceView({device: device});
				this.$el.append(v.render().el);
				this.subviews.push(v);
			}
			return this;
		}

	});

});