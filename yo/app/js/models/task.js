// Filename: models/task.js
define([
	'backbone'
], function(Backbone) {
	var TaskModel = Backbone.Model.extend({

		initialize: function(options) {
			this.url = options.url;
			this.set('actions', []);
			this.set('conditions', []);
		},

		hasTriggerCondition: function() {
			return (this.get('triggerCondition'));
		},

		setTriggerCondition: function(c) {
			this.set('triggerCondition', c);
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