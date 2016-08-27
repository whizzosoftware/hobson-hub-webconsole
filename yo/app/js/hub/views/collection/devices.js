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

		initialize: function(options) {
			this.devices = options.devices;
			this.value = options.value;
			this.subviews = [];
		},

		remove: function() {
			for (var i=0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html('');
			for (var i=0; i < this.devices.length; i++) {
				var device = this.devices.at(i);
				var v = new DeviceView({
					device: device, 
					selected: this.value.indexOf(device.get('@id')) > -1
				});
				this.$el.append(v.render().el);
				this.subviews.push(v);
			}
			return this;
		}

	});

});