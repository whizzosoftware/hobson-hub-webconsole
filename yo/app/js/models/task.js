// Filename: models/task.js
define([
	'backbone'
], function(Backbone) {

	var TaskModel = Backbone.Model.extend({

		initialize: function(options) {
			this.url = options.url;
			this.set('actionSet', {actions: []});
			this.set('conditionSet', {conditions: []});
		},

		hasTriggerCondition: function() {
			return this.get('conditionSet').trigger;
		},

		setTriggerCondition: function(c) {
			this.get('conditionSet').trigger = c;
		},

		hasConditions: function() {
			return (this.get('conditionSet').conditions > 0);
		},

		addCondition: function(c) {
			this.get('conditionSet').conditions.push(c);
		},

		hasActions: function() {
			return (this.get('actionSet').actions.length > 0);
		},

		addAction: function(a) {
			this.get('actionSet').actions.push(a)
		}

	});

	return TaskModel;

});