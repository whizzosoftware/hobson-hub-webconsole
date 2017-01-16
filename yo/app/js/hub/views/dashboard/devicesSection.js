// Filename: views/dashboard/devicesSection.js
define([
	'jquery',
	'underscore',
	'backbone',
	'bridget',
	'masonry',
	'views/dashboard/section',
	'views/dashboard/tiles/camera',
	'views/dashboard/tiles/lightbulb',
	'views/dashboard/tiles/sensor',
	'views/dashboard/tiles/switch',
	'views/dashboard/tiles/thermostat',
	'views/dashboard/tiles/weatherStation',
	'views/dashboard/tiles/securityPanel',
	'views/dashboard/tiles/unknown',
	'i18n!nls/strings',
	'text!templates/dashboard/tileGroup.html'
], function($, _, Backbone, bridget, Masonry, Section, CameraTileView, LightbulbTileView, SensorTileView, SwitchTileView, ThermostatTileView, WeatherStationTileView, SecurityPanelTileView, UnknownTileView, strings, template) {

	return Section.extend({

		initialize: function(options) {
			options.template = template;
			Section.prototype.initialize.call(this, options);
			this.filter = options.filter;
			this.type = 'device';
			bridget('masonry', Masonry);
		},

    onDeviceAvailability: function(event) {
		  var s = this.subviews[event.id];
		  if (s) {
		    s.onDeviceAvailability(true);
      }
    },

    onDeviceUnavailability: function(event) {
      var s = this.subviews[event.properties.id];
      if (s) {
        s.onDeviceAvailability(false);
      }
    },

    onDeviceVariableUpdate: function(event) {
		  for (var i in this.subviews) {
		    this.subviews[i].onDeviceVariableUpdate(event);
      }
    },

		renderSection: function(model) {
			var tilesAdded = false;

			// add any potentially new device tiles
			for (var ix=0; ix < model.length; ix++) {
				var d = model[ix];
				var sv = this.subviews[d.get('@id')];
				if (sv) {
					sv.model = d;
				} else {
					this.addDeviceView(d);
					tilesAdded = true;
				}
			}

			// render all subviews
			for (var ix in this.subviews) {
				this.subviews[ix].render();
			}

			// force masonry to re-layout the tile grid if tiles were added
			if (tilesAdded) {
				$('.dash-tiles').masonry({
					itemSelector: '.tile',
					gutter: 10
				});
			}
		},

		addDeviceView: function(device) {
			if (device && !this.subviews[device.get('@id')]) {
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
				} else if (device.get("type") === 'SECURITY_PANEL') {
					tileView = new SecurityPanelTileView({model: device});
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
