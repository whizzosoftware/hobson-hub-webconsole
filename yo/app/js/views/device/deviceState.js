// Filename: views/device/deviceState.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/device/deviceTab',
	'i18n!nls/strings',
	'text!templates/device/deviceState.html'
], function($, _, Backbone, DeviceTab, strings, template) {

	return DeviceTab.extend({

		tabName: 'state',

		template: _.template(template),

		initialize: function(options) {
			this.device = options.device;
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				device: this.device.toJSON()
			}));

			return this;
		}

	});

});