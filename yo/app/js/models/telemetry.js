// Filename: models/telemetry.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({
		url: function() {
			return this.get('url');
		},
		hasData: function() {
			return (this.get('data'));
		}
	});
});