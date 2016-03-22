// Filename: views/device/baseStatus.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/variable',
	'services/device',
	'i18n!nls/strings'
], function($, _, Backbone, toastr, ItemList, Variable, DeviceService, strings) {

	return Backbone.View.extend({

		defaultRefreshInterval: 5000,

		fastRefreshInterval: 500,

		timeoutInterval: 7000,

		alwaysRefresh: false,

		initialize: function() {
			this.intervalRef = null;
			this.pendingUpdates = {};
			this.variables = {};

			// save initial variable values
			var variables = this.model.get('variables').itemListElement;
			for (var ix = 0; ix < variables.length; ix++) {
				var variable = variables[ix].item;
				this.variables[variable.name] = variable;
				this.pendingUpdates[variable.name] = null;
			}

			// start the refresh timer
			this.setRefreshInterval(this.defaultRefreshInterval);
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

		addPendingUpdate: function(name, value) {
			this.pendingUpdates[name] = {
				value: value,
				time: new Date().getTime()
			};
			this.setRefreshInterval(this.fastRefreshInterval);
		},

		hasPendingUpdates: function() {
			for (var name in this.pendingUpdates) {
				if (this.pendingUpdates[name]) {
					return true;
				}
			}
			return false;
		},

		processUpdate: function(name, value) {
			// clear pending update if the value is what's expected
			if (this.pendingUpdates[name] && DeviceService.isDeviceVariableValueEqual(this.pendingUpdates[name].value, value)) {
				this.pendingUpdates[name] = null;
			}

			// notify subclass
			if (this.onVariableUpdate) {
				this.onVariableUpdate(name, value);
			}

			// set refresh interval appropriately
			if (!this.hasPendingUpdates()) {
				this.setRefreshInterval(this.defaultRefreshInterval);
				this.refresh();
			}
		},

		processTimeout: function(name) {
			// clear pending update
			this.pendingUpdates[name] = null;

			// notify subclass
			if (this.onVariableUpdateTimeout) {
				this.onVariableUpdateTimeout(name);
			}

			// set refresh interval appropriately
			if (!this.hasPendingUpdates()) {
				this.setRefreshInterval(5000);
				this.refresh();
			}
		},

		setVariableValues: function(values) {
			// check if any of the values are different from the current
			var change = false;
			for (var name in values) {
				var v = this.getVariable(name);
				if (!v || values[name] !== v.value) {
					change = true;
				}
			}
			if (change) {
				DeviceService.setDeviceVariables(this, this.model.get('variables')['@id'], values)
					.error(function(response) {
						if (response.status >= 200 && response.status <= 299) {
							for (var name in values) {
								if (this.variables[name] && this.variables[name].mask !== 'WRITE_ONLY') {
									this.addPendingUpdate(name, values[name]);
								} else {
									this.onVariableUpdate(name);
								}
							}
						} else {
							this.onVariableUpdateFailure();
						}
					});
			}
		},

		refresh: function() {
			var variables = new ItemList(null, {model: Variable, url: this.model.get('variables')['@id'] + '?expand=item'});
			variables.fetch({
				context: this,
				success: function(model, response, options) {
					// process any changed variable values
					for (var ix = 0; ix < model.length; ix++) {
						var v1 = model.at(ix);
						var v2 = options.context.variables[v1.get('name')];
						if (v1 && v2 && v1.get('value') !== v2.value) {
							options.context.variables[v1.get('name')] = v1.toJSON();
							options.context.processUpdate(v1.get('name'), v1.get('value'));
						}
					}

					// process any update timeouts
					var now = new Date().getTime();
					for (var name in options.context.pendingUpdates) {
						var pu = options.context.pendingUpdates[name];
						if (pu) {
							if (now - pu.time >= options.context.timeoutInterval) {
								options.context.processTimeout(name);
							}
						}
					}
				},
				error: function(model, response, options) {
					toastr.error(strings.ErrorOccurred);
				}
			});
		}

	});

});