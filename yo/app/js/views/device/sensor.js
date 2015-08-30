// Filename: views/device/sensor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'views/device/sensorTile',
	'i18n!nls/strings',
	'text!templates/device/deviceState.html'
], function($, _, Backbone, toastr, Variable, BaseStatusView, SensorTileView, strings, template) {

	return BaseStatusView.extend({

		tagName: 'ul',

		className: 'sensor-tiles small-block-grid-2 medium-block-grid-3 large-block-grid-4',

		template: _.template(template),

		events: {
			'click #switchButton': 'onClick'
		},

		initialize: function() {
			BaseStatusView.prototype.initialize.call(this);
			this.subviews = [];
			console.debug('model', this.model);
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function(el) {
			this.$el.html('');
			for (var i in this.variables) {
				if (this.variables[i].value) {
					this.addSensorView(this.variables[i]);
				}
			}
			return this;
		},

		onVariableUpdate: function(name, value) {
			this.render();
		},

		addSensorView: function(plugin) {
			var sensorView = new SensorTileView({model: plugin});
			this.subviews.push(sensorView);
			this.$el.append(sensorView.render().el);
		}

	});

});