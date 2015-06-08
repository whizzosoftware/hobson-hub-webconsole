// Filename: models/telemetryDataset.js
define([
	'backbone'
], function(Backbone) {

	return Backbone.Model.extend({

		hasData: function() {
			return (this.get('data').numberOfItems && this.get('data').numberOfItems > 0);
		}

	});

});