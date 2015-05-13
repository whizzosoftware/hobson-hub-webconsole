// Filename: collections/taskActionClasses.js
define([
	'backbone',
	'models/taskActionClass'
], function(Backbone, TaskActionClass) {
	var TaskActionClassCollection = Backbone.Collection.extend({

		model: TaskActionClass,

		initialize: function(options) {
			this.url = options.url;
		}

	});

	return TaskActionClassCollection;
});