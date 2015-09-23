// Filename: views/dashboard/tileGroup.js
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
	'i18n!nls/strings',
	'text!templates/dashboard/tileGroup.html'
], function($, _, Backbone, bridget, Masonry, CameraTileView, LightbulbTileView, SensorTileView, SwitchTileView, ThermostatTileView, WeatherStationTileView, UnknownTileView, strings, template) {

	return Backbone.View.extend({
		className: 'dash-tile-group',

		template: _.template(template),

		initialize: function(options) {
			bridget('masonry', Masonry);

			this.name = options.name;
			this.filterFunc = options.filterFunc;
			this.subviews = {};
			this.subviewCount = 0;
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
				this.subviews[ix] = null;
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({name: this.name, model: this.model, strings: strings}));
			if (this.model) {
				for (var ix=0; ix < this.model.length; ix++) {
					var d = this.model.at(ix);
					this.addDeviceView(d);
				}

				// force masonry to re-layout the tile grid
				$('.dash-tiles').masonry({
					itemSelector: '.tile',
					gutter: 10
				});
			}
			return this;
		},


		reRender: function() {
			if (this.model.length > 0) {
				// if the new device count is different than the subview count, do a complete re-render
				if (this.model.length != this.subviewCount) {
					this.render();
				} else {
					// re-render existing tiles
					for (var ix=0; ix < this.model.length; ix++) {
						var d = this.model.at(ix);
						var v = this.subviews[d.get('@id')];
						if (v) {
							v.reRender(d);
						}
					}
				}
			}
		},

		addDeviceView: function(device) {
			if (device) {
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
				this.$el.find('.dash-tiles').append(tileView.render().el);
				this.subviews[device.get('@id')] = tileView;
				this.subviewCount++;
			}
		}		

	});

});