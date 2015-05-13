// Filename: views/dashboardTiles
define([
	'jquery',
	'underscore',
	'backbone',
	'views/dashboard/deviceTile',
	'i18n!nls/strings',
	'text!templates/dashboard/deviceTile.html'
], function($, _, Backbone, DeviceTileView, strings, deviceTileTemplate) {

	var DeviceTilesView = Backbone.View.extend({
		className: 'dash-tiles',

		subviews: [],

		initialize: function(devices) {
			this.devices = devices;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			for (var i = 0; i < this.devices.length; i++) {
				var device = this.devices.at(i);
				if (device) {
					var tileView = new DeviceTileView(device);
					this.$el.append(tileView.render().el);
					this.subviews.push(tileView);
				}
			}
			return this;
		}
	});

	return DeviceTilesView;
});