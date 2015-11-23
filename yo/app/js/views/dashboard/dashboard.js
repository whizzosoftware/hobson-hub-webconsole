// Filename: views/dashboard
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'services/device',
	'models/itemList',
	'views/dashboard/devicesSection',
	'views/dashboard/presenceEntitiesSection',
	'i18n!nls/strings',
	'text!templates/dashboard/dashboard.html'
], function($, _, Backbone, toastr, HubService, DeviceService, ItemList, DevicesSection, PresenceEntitiesSection, strings, template) {

	return Backbone.View.extend({
		tagName: 'div',

		template: _.template(template),

		events: {
			'deviceButtonClick': 'onDeviceButtonClick'
		},

		initialize: function(options) {
			this.subviews = [];
			this.deviceTypes = {};
			_.bind(this.renderSections, this);
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
			this.addSection(new DevicesSection({
				name: 'Cameras',
				filter: function(d) { return d.get('type') === 'CAMERA' }
			}));
			this.addSection(new PresenceEntitiesSection({
				name: 'Presence'
			}));
			this.addSection(new DevicesSection({
				name: 'Sensors',
				filter: function(d) { return d.get('type') === 'SENSOR' }
			}));
			this.addSection(new DevicesSection({
				name: 'Devices',
				filter: function(d) { return (d.get('type') !== 'CAMERA' && d.get('type') !== 'LIGHTBULB' && d.get('type') !== 'SENSOR') }
			}));
			this.addSection(new DevicesSection({
				name: 'Lights',
				filter: function(d) { return d.get('type') === 'LIGHTBULB' }
			}));

			// render initial device tiles
			this.refresh();

			// start the refresh interval
			this.clearRefreshInterval();
			this.refreshInterval = setInterval(function() {
				this.refresh();
			}.bind(this), 5000);

			return this;
		},

		addSection: function(section) {
			this.$el.find('#tileGroups').append(section.render().el);
			this.subviews.push(section);
		},

		refresh: function() {
			// build request headers
			var headers = {};
			// if (this.etag) {
			// 	headers['If-None-Match'] = this.etag;
			// }

			// fetch the device list
			HubService.getDashboardData(
				this, 
				headers, 
				function(model, response, options) {
					options.context.etag = options.xhr.getResponseHeader('ETag');
					if (options.xhr.status !== 304) {
						options.context.renderSections(model);
					} else {
						options.context.renderSections(null);
					}
				}, 
				function(model, response, options) {
					toastr.error(strings.DeviceListRetrieveError);
				}
			);
		},

		renderSections: function(newModel) {
			var hadContent = false;

			// render all subviews
			for (var ix in this.subviews) {
				var section = this.subviews[ix];
				var m = null;

				if (newModel) {
					if (section.type && section.type === 'device') {
						m = newModel.get('devices');
					} else if (section.type && section.type === 'presence') {
						m = newModel.get('presenceEntities');
					}
				}

				if (m) {
					section.updateModel(m);
					hadContent = hadContent || section.hasContent();
				}

				section.render();
			}

			// hide the loading indicator
			this.$el.find('#loading').css('display', 'none');

			// hide/show the "no device" notice as appropriate
			if (!hadContent && newModel) {
				this.$el.find('.notice').css('display', 'block');
			} else {
				this.$el.find('.notice').css('display', 'none');
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