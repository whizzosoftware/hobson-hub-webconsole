// Filename: models/plugins.js
define([
	'backbone',
	'models/taskConditionClass'
], function(Backbone, TaskConditionClass) {

	var TaskConditionClassCollection = Backbone.Collection.extend({
		model: TaskConditionClass,

		initialize: function(url) {
			this.url = url + '?details=true';
		}
	});

	return TaskConditionClassCollection;
});