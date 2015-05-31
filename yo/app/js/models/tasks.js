// Filename: models/tasks.js
define([
	'backbone',
	'models/task'
], function(Backbone, Task) {

	return Backbone.Collection.extend({
		model: Task,

		initialize: function(url) {
			this.url = url;
		}
	});

});