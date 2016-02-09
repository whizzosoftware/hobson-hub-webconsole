// Filename: models/task.js
define([
	'backbone'
], function(Backbone) {

	return Backbone.Model.extend({

		initialize: function(options) {
			if (options && options.url) {
				this.url = options.url;
			} else if (options && options['@id']) {
				this.url = options['@id'];
			}
			this.set('actionSet', {actions: []});
			this.set('conditions', []);
		},

		idAttribute : '@id',

		url: function() {
			return this.url;
		},

		addCondition: function(c) {
			this.get('conditions').push(c);
		},

		hasConditions: function() {
			return (this.get('conditions').length > 0);
		},

		getConditions: function() {
			return this.get('conditions');
		},

		hasTriggerCondition: function(conditionClasses) {
			return (this.getTriggerConditionIndex(conditionClasses) > -1);
		},

		getTriggerConditionIndex: function(conditionClasses) {
			var taskConditions = this.get('conditions');
			for (var i=0; i < taskConditions.length; i++) {
				var c = taskConditions[i];
				var cc;
				for (var i2=0; i2 < conditionClasses.length; i2++) {
					var pcc = conditionClasses.at(i2);
					if (pcc.get('@id') === c.cclass['@id']) {
						cc = pcc;
					}
				}
				if (cc && cc.get('type') === 'trigger') {
					return i;
				}
			}
			return -1;
		},

		getConditionIndex: function(condition) {
			var taskConditions = this.get('conditions');
			for (var i=0; i < taskConditions.length; i++) {
				var c = taskConditions[i];
				if (c['@id'] == condition['@id']) {
					return i;
				}
			}
			return -1;
		},

		hasActions: function() {
			return (this.get('actionSet').actions.length > 0);
		},

		addAction: function(a) {
			this.get('actionSet').actions.push(a)
		}

	});

});