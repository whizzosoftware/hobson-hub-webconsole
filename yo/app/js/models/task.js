// Filename: models/task.js
define([
	'backbone'
], function(Backbone) {

	return Backbone.Model.extend({

		initialize: function(options) {
			if (options.url) {
				this.url = options.url;
			} else if (options['@id']) {
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

		getConditions: function() {
			return this.get('conditions');
		},

		hasActions: function() {
			return (this.get('actionSet').actions.length > 0);
		},

		addAction: function(a) {
			this.get('actionSet').actions.push(a)
		}

	});

});