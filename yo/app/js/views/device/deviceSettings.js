// Filename: views/device/deviceSettings.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/config',
	'views/device/deviceTab',
	'views/configProperty',
	'i18n!nls/strings',
	'text!templates/device/deviceSettings.html'
], function($, _, Backbone, toastr, Config, DeviceTab, ConfigPropertyView, strings, template) {

	return DeviceTab.extend({

		tabName: 'settings',

		template: _.template(template),

		subviews: [],

		events: {
			'click #saveButton': 'onClickSave'
		},

		initialize: function(options) {
			this.device = options.device;
			this.deviceConfig = options.deviceConfig;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				device: this.device.toJSON()
			}));

			var formEl = this.$el.find('form');

			var properties = this.deviceConfig.get('properties');
			for (var property in properties) {
				var v = new ConfigPropertyView({id: property, property: properties[property]});
				formEl.append(v.render().el);
				this.subviews.push(v);
			}

			return this;
		},

		onClickSave: function(event) {
			event.preventDefault();
			var config = new Config({
				id: 'id',
				url: this.deviceConfig.get('links').self
			});
			for (var i=0; i < this.subviews.length; i++) {
				var v = this.subviews[i];
				config.setProperty(v.getId(), v.getValue());
			}
			console.debug('Going to save: ', config);
			config.save(null, {
				error: function(model, response) {
					console.debug(model, response);
					if (response.status === 202) {
						toastr.success(strings.PluginConfigurationSaved);
					} else {
						toastr.error(strings.PluginConfigurationNotSaved);
					}
				}
			});
			this.$el.foundation('reveal', 'close');
		}		

	});

});