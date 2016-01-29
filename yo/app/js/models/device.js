// Filename: models/device.js
define([
	'backbone'
], function(Backbone) {
	var DeviceModel = Backbone.Model.extend({
		url: function() {
			return this.get('url');
		},
		isOn: function() {
			var prefVar = this.get('preferredVariable');
			return (prefVar && prefVar.name === 'on' && prefVar.value);
		},
		isArmed: function() {
			var prefVar = this.get('preferredVariable');
			return (prefVar && prefVar.name === 'armed' && prefVar.value);
		},
		setPreferredVariableValue: function(value) {
			var prefVar = this.get('preferredVariable');
			if (prefVar) {
				prefVar.value = value;
			}
		}
	});

	return DeviceModel;
});