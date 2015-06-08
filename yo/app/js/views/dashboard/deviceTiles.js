// Filename: views/dashboardTiles
define([
	'jquery',
	'underscore',
	'backbone',
	'bridget',
	'masonry',
	'views/dashboard/deviceTile',
	'i18n!nls/strings',
	'text!templates/dashboard/deviceTile.html'
], function($, _, Backbone, bridget, Masonry, DeviceTileView, strings, deviceTileTemplate) {

	return Backbone.View.extend({
		className: 'dash-tiles',

		subviews: {},

		initialize: function() {
			bridget('masonry', Masonry);
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
				this.subviews[ix] = null;
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			if (this.model) {
				for (var i = 0; i < this.model.length; i++) {
					this.addDeviceView(this.model.at(i));
				}
			}

			return this;
		},

		reRender: function(model) {
			this.model = model;

			for (var ix=0; ix < model.length; ix++) {
				var device = this.model.at(ix);
				var dview = this.subviews[device.get('@id')];
				if (dview) {
					dview.reRender(device);
				} else {
					this.addDeviceView(device);
				}
			}

			$('.dash-tiles').masonry({
				itemSelector: '.tile',
				gutter: 10
			});
		},

		addDeviceView: function(device) {
			if (device) {
				var tileView = new DeviceTileView({model: device});
				this.$el.append(tileView.render().el);
				this.subviews[device.get('@id')] = tileView;
			}
		}

	});

});