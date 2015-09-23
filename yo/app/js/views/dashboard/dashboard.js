// Filename: views/dashboard
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/device',
	'models/devices',
	'views/dashboard/tileGroup',
	'i18n!nls/strings',
	'text!templates/dashboard/dashboard.html'
], function($, _, Backbone, toastr, ItemList, Device, Devices, TileGroupView, strings, template) {

	return Backbone.View.extend({
		tagName: 'div',

		template: _.template(template),

		events: {
			'deviceButtonClick': 'onDeviceButtonClick'
		},

		initialize: function(options) {
			this.url = options.url;
			this.initialRender = true;
			this.subviews = [];
			this.deviceTypes = {};
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}

			this.clearRefreshInterval();

			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			$('#toolbar').css('display', 'block');

			// create dashboard shell
			this.$el.html(this.template({strings: strings}));

			// create tile groups
			var el = this.$el.find('#tileGroups');
			this.addTileGroup('Cameras', function(d) { return d.get('type') === 'CAMERA'});
			this.addTileGroup('Lights', function(d) { return d.get('type') === 'LIGHTBULB'});
			this.addTileGroup('Sensors', function(d) { return d.get('type') === 'SENSOR'});
			this.addTileGroup('Others', function(d) { return (d.get('type') !== 'CAMERA' && d.get('type') !== 'LIGHTBULB' && d.get('type') !== 'SENSOR')});

			// render initial device tiles
			this.refresh();

			// start the refresh interval
			this.clearRefreshInterval();
			this.refreshInterval = setInterval(function() {
				this.refresh();
			}.bind(this), 5000);

			return this;
		},

		addTileGroup: function(name, filterFunc) {
			var tg = new TileGroupView({name: name, filterFunc: filterFunc});
			this.$el.find('#tileGroups').append(tg.render().el);
			this.subviews.push(tg);
		},

		refresh: function() {
			if (this.url) {
				var devices = new ItemList({model: Device, url: this.url, sort: 'name'});
				var headers = {};

				// set the If-None-Modified header if an ETag was received from a prior response
				if (this.etag) {
					headers['If-None-Match'] = this.etag;
				}

				// fetch the device list
				devices.fetch({
					context: this,
					headers: headers,
					success: function(model, response, options) {
						options.context.etag = options.xhr.getResponseHeader('ETag');
						options.context.model = model;
						options.context.renderTileGroups(options.context);
					},
					error: function(model, response, options) {
						toastr.error(strings.DeviceListRetrieveError);
					}
				});
			}
		},

		renderTileGroups: function(self) {
			var hadContent = false;

			// check if there's a device type we haven't encountered before
			for (var ix=0; ix < self.model.length; ix++) {
				var d = self.model.at(ix);
				if (!self.deviceTypes[d.get('type')]) {
					this.initialRender = true;
					self.deviceTypes[d.get('type')] = true;
				}
			}

			// render all subviews
			for (var ix in self.subviews) {
				var tg = self.subviews[ix];
				var newModel = new Devices(self.model.filter(tg.filterFunc));
				hadContent = hadContent || newModel.length > 0;
				tg.model = newModel;
				if (this.initialRender) {
					tg.render();
				} else {
					tg.reRender();
				}
			}

			// reset initial render flag
			if (this.initialRender) {
				this.initialRender = false;
			}

			if (!hadContent) {
				self.$el.html('<p class="notice">' + strings.NoDevicesPublished + '</p>');
			}
		},

		clearRefreshInterval: function() {
			if (this.refreshInterval) {
				clearInterval(this.refreshInterval);
				this.refreshInterval = null;
			}
		},

		onDeviceButtonClick: function(event, device) {
			var pluginId = device.get('pluginId');
			var deviceId = device.get('id');
			var deviceUrl = device.get('@id');
			Backbone.history.navigate('#device/' + encodeURIComponent(deviceUrl) + '/state', {trigger: true});
		}
	});

});