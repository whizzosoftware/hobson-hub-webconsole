// Filename: views/dashboard
define([
	'jquery',
	'underscore',
	'backbone',
	'models/itemList',
	'models/device',
	'views/dashboard/deviceTiles',
	'i18n!nls/strings',
	'text!templates/dashboard/dashboard.html'
], function($, _, Backbone, ItemList, Device, DeviceTilesView, strings, template) {

	return Backbone.View.extend({
		tagName: 'div',

		template: _.template(template),

		refreshInterval: null,

		events: {
			'deviceButtonClick': 'onDeviceButtonClick'
		},

		initialize: function(options) {
			this.url = options.url;
		},

		remove: function() {
			if (this.tilesView) {
				this.tilesView.remove();
			}

			this.clearRefreshInterval();

			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			$('#toolbar').css('display', 'block');

			// create dashboard shell
			this.$el.append(this.template({strings: strings}));

			// render the device tile container
			this.tilesView = new DeviceTilesView();
			this.$el.find('#tile-row').html(this.tilesView.render().el);

			// render initial device tiles
			this.refresh();

			// start the refresh interval
			this.clearRefreshInterval();
			this.refreshInterval = setInterval(function() {
				this.refresh();
			}.bind(this), 5000);

			return this;
		},

		refresh: function() {
			if (this.url) {
				var devices = new ItemList({model: Device, url: this.url, sort: 'name'});
				devices.fetch({
					context: this,
					success: function(model, response, options) {
						options.context.model = model;
						options.context.renderTiles(options.context);
					},
					error: function(model, response, options) {
						console.error('Error retrieving devices');
					}
				});
			}
		},

		renderTiles: function(self) {
			self.tilesView.reRender(self.model);
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