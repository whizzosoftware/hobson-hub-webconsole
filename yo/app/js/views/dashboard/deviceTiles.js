// Filename: views/deviceTiles
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

		initialize: function() {
			bridget('masonry', Masonry);
			this.subviews = [];
			this.noDevicesPrompt = false;
			console.debug('deviceTiles.initialize()', this.subviewMap);
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
				this.subviews[ix] = null;
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			if (this.model && this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					this.addDeviceView(this.model.at(i));
				}
			} else {
				this.$el.html('<p class="notice">' + strings.NoDevicesPublished + '</p>');
				this.noDevicesPrompt = true;
			}

			return this;
		},

		reRender: function(model) {
			this.model = model;

			if (model.length > 0) {
				// remove the no device prompt
				if (this.noDevicesPrompt) {
					this.$el.html('');
					this.noDevicesPrompt = false;
				}

				// re-render existing device tiles and/or add new ones
				for (var ix=0; ix < model.length; ix++) {
					var device = this.model.at(ix);
					var dview = this.subviews[device.get('@id')];
					if (dview) {
						dview.reRender(device);
					} else {
						this.addDeviceView(device);
					}
				}

				// force masonry to re-layout the tile grid
				$('.dash-tiles').masonry({
					itemSelector: '.tile',
					gutter: 10
				});
			}
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