// Filename: models/task.js
define([
	'backbone'
], function(Backbone) {
	var TaskModel = Backbone.Model.extend({

		initialize: function(options) {
			this.url = options.url;
			this.set('name', 'New Task');
			this.set('actions', []);
			this.set('conditions', []);
		},

		hasConditions: function() {
			return (this.get('conditions').length > 0);
		},

		addCondition: function(c) {
			this.get('conditions').push(c);
		},

		hasActions: function() {
			return (this.get('actions').length > 0);
		},

		addAction: function(a) {
			this.get('actions').push(a)
		}

	});

	return TaskModel;
});