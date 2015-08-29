// Filename: views/deviceTiles
define([
	'jquery',
	'underscore',
	'backbone',
	'bridget',
	'masonry',
	'views/dashboard/tiles/camera',
	'views/dashboard/tiles/lightbulb',
	'views/dashboard/tiles/sensor',
	'views/dashboard/tiles/switch',
	'views/dashboard/tiles/thermostat',
	'views/dashboard/tiles/weatherStation',
	'views/dashboard/tiles/unknown',
	'i18n!nls/strings'
], function($, _, Backbone, bridget, Masonry, CameraTileView, LightbulbTileView, SensorTileView, SwitchTileView, ThermostatTileView, WeatherStationTileView, UnknownTileView, strings) {

	return Backbone.View.extend({
		className: 'dash-tiles',

		initialize: function() {
			bridget('masonry', Masonry);
			this.subviews = [];
			this.noDevicesPrompt = false;
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
				console.debug(device);
				var tileView;
				if (device.get("type") === 'SENSOR') {
					tileView = new SensorTileView({model: device});
				} else if (device.get("type") === 'LIGHTBULB') {
					tileView = new LightbulbTileView({model: device});
				} else if (device.get("type") === 'CAMERA') {
					tileView = new CameraTileView({model: device});
				} else if (device.get("type") === 'THERMOSTAT') {
					tileView = new ThermostatTileView({model: device});
				} else if (device.get("type") === 'SWITCH') {
					tileView = new SwitchTileView({model: device});
				} else if (device.get("type") === 'WEATHER_STATION') {
					tileView = new WeatherStationTileView({model: device});
				} else {
					tileView = new UnknownTileView({model: device});
				}
				this.$el.append(tileView.render().el);
				this.subviews[device.get('@id')] = tileView;
			}
		}

	});

});