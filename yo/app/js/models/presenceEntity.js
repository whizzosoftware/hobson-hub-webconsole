// Filename: models/presenceEntity.js
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
			}
		}

	});
});