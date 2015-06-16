// Filename: models/task.js
define([
	'backbone'
], function(Backbone) {

	var TaskModel = Backbone.Model.extend({

		initialize: function(options) {
			if (options.url) {
				this.url = options.url;
			} else if (options['@id']) {
				this.url = options['@id'];
			}
			this.set('actionSet', {actions: []});
			this.set('conditionSet', {conditions: []});
		},

		idAttribute : '@id',

		url: function() {
			return this.url;
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