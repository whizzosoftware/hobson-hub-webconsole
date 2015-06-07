// Filename: views/dashboard
define([
	'jquery',
	'underscore',
	'backbone',
	'bridget',
	'masonry',
	'views/dashboard/deviceTiles',
	'i18n!nls/strings',
	'text!templates/dashboard/dashboard.html'
], function($, _, Backbone, bridget, Masonry, DeviceTilesView, strings, dashboardTemplate) {

	var DashboardView = Backbone.View.extend({
		tagName: 'div',

		template: _.template(dashboardTemplate),

		events: {
			'deviceIconClick': 'onDeviceIconClick',
			'deviceButtonClick': 'onDeviceButtonClick'
		},

		initialize: function(options) {
			this.devices = options.devices;
		},

		remove: function() {
			if (this.tilesView) {
				this.tilesView.remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			$('#toolbar').css('display', 'block');

			// create dashboard shell
			this.$el.append(this.template({strings: strings}));

			// render the collection into the tile row
			if (this.devices.length > 0) {
				this.tilesView = new DeviceTilesView(this.devices);
				this.$el.find('#tile-row').html(this.tilesView.render().el);
			} else {
				this.$el.find('#tile-row').html(
					'<p class="notice">There are no devices to show. You should <a href="#settings/plugins?filter=available">install plugins</a> to create some.</p>'
				);
			}

			return this;
		},

		hubSettingsClick: function() {
			console.debug('Hub settings!');
		},

		onDeviceIconClick: function(event, device) {
			console.debug(device);
			var pluginId = device.get('pluginId');
			var deviceId = device.get('id');
			console.debug('device icon clicked: ', pluginId, deviceId);
		},

		onDeviceButtonClick: function(event, device) {
			var pluginId = device.get('pluginId');
			var deviceId = device.get('id');
			console.debug('device button clicked: ', pluginId, deviceId);
			var deviceUrl = device.get('@id');
			console.debug('Device clicked: ', encodeURIComponent(deviceUrl));
			Backbone.history.navigate('#device/' + encodeURIComponent(deviceUrl) + '/state', {trigger: true});
		}
	});

	return DashboardView;
});