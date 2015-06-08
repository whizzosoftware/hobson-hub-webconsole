// Filename: views/device/lightbulb.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/itemList',
	'models/variable'
], function($, _, Backbone, ItemList, Variable) {

	return Backbone.View.extend({

		pendingUpdates: {},

		intervalRef: null,

		variables: {},

		showPending: false,

		initialize: function() {
			// save initial variable values
			var variables = this.model.get('variables').itemListElement;
			for (var ix = 0; ix < variables.length; ix++) {
				var variable = variables[ix].item;
				this.variables[variable.name] = variable;
			}

			// start the refresh timer
			this.setRefreshInterval(5000);
		},

		remove: function() {
			this.setRefreshInterval(null);
			Backbone.View.prototype.remove.call(this);
		},

		getVariable: function(name) {
			return this.variables[name];
		},

		setRefreshInterval: function(i) {
			if (this.intervalRef) {
				clearInterval(this.intervalRef);
			}
			if (i) {
				this.intervalRef = setInterval(function() {
					this.refresh();
				}.bind(this), i);
			}
		},

		setPendingUpdates: function(updates) {
			this.pendingUpdates = updates;
			this.showPending = true;
			this.setRefreshInterval(1000);
			this.render();
		},

		processUpdate: function(name, value) {
			if (this.pendingUpdates[name] === value) {
				this.pendingUpdates[name] = null;
			}
			var more = false;
			for (var ix = 0; ix < this.pendingUpdates.length; ix++) {
				if (this.pendingUpdates[ix] !== null) {
					more = true;
					break;
				}
			}
			if (!more) {
				this.showPending = false;
				this.setRefreshInterval(5000);
				this.refresh();
			}
		},

		refresh: function() {
			var variables = new ItemList({model: Variable, url: this.model.get('variables')['@id'] + '?expand=item'});
			variables.fetch({
				context: this,
				success: function(model, response, options) {
					// check if any variable values have changed
					var change = false;
					for (var ix = 0; ix < model.length; ix++) {
						var v1 = model.at(ix);
						var v2 = options.context.variables[v1.get('name')];
						if (v1 && v2 && v1.get('value') !== v2.value) {
							options.context.variables[v1.get('name')] = v1.toJSON();
							options.context.processUpdate(v1.get('name'), v1.get('value'));
							change = true;
						}
					}

					// if any have changed, re-render
					if (change) {
						options.context.render();
					}
				},
				error: function(model, response, options) {
					console.debug('variable refresh failed');
				}
			});
		}

	});

});