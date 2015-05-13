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
			console.debug('DashboardView.initialize');
			this.devices = options.devices;
		},

		remove: function() {
			this.tilesView.remove();
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			console.debug('render dashboard');

			$('#toolbar').css('display', 'block');

			// create dashboard shell
			this.$el.append(this.template({strings: strings}));

			// render the collection into the tile row
			this.tilesView = new DeviceTilesView(this.devices);
			this.$el.find('#tile-row').append(this.tilesView.render().el);

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
			var deviceUrl = device.get('links').self;
			console.debug('Device clicked: ', encodeURIComponent(deviceUrl));
			Backbone.history.navigate('#device/' + encodeURIComponent(deviceUrl) + '/state', {trigger: true});
		}
	});

	return DashboardView;
});