// Filename: models/devicesData.js
define([
	'backbone',
	'models/itemList',
	'models/device',
	'models/presenceEntity'
], function(Backbone, ItemList, Device, PresenceEntity) {
	return Backbone.Model.extend({

		url: function() {
			return this.get('url');
		},

		parse: function(data) {
			if (data) {
				this.set('devices', new ItemList(data.devices, {model: Device, parse: true}));
				this.set('presenceEntities', new ItemList(data.presenceEntities, {model: PresenceEntity, parse: true}));
			}
		}

	});

	return HubModel;
});
