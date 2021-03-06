// Filename: views/device/sensor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'views/device/sensorTile',
	'i18n!nls/strings'
], function($, _, Backbone, toastr, Variable, BaseStatusView, SensorTileView, strings) {

	return BaseStatusView.extend({

		tagName: 'ul',

		className: 'sensor-tiles small-block-grid-2 medium-block-grid-3 large-block-grid-4',

		events: {
			'click #switchButton': 'onClick'
		},

		initialize: function(options) {
			BaseStatusView.prototype.initialize.call(this, options);
			this.subviews = [];
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
			}
			BaseStatusView.prototype.remove.call(this);
		},

		render: function(el) {
			this.$el.html('');
			for (var i in this.variables) {
        this.addSensorView(this.variables[i]);
			}
			return this;
		},

		onVariableUpdate: function(name, value) {
			this.render();
		},

		addSensorView: function(plugin) {
			var sensorView = new SensorTileView({model: plugin, available: this.available});
			this.subviews.push(sensorView);
			this.$el.append(sensorView.render().el);
		}

	});

});
