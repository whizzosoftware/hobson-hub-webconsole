// Filename: models/deviceConfig.js
define([
	'backbone'
], function(Backbone) {
	var DeviceConfigurationModel = Backbone.Model.extend({
		initialize: function(options, url) {
			this.url = url;
		}
	});

	return DeviceConfigurationModel;
});