// Filename: models/device.js
define([
	'backbone',
	'models/actionClass'
], function(Backbone, ActionClass) {
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
		},
		getActionClass: function(id) {
			var acs = this.get('actionClasses');
			for (var i=0; i < acs.numberOfItems; i++) {
				var item = acs.itemListElement[i].item;
				if (item['@id'] === id) {
					return new ActionClass(item);
				}
			}
			return null;
		}
	});

	return DeviceModel;
});