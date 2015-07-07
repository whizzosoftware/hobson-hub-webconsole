// Filename: views/device/deviceSettings.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/propertyContainer',
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

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				device: this.model.toJSON()
			}));

			var formEl = this.$el.find('form');

			var properties = this.model.get('configurationClass').supportedProperties;
			for (var ix in properties) {
				var property = properties[ix];
				var v = new ConfigPropertyView({
					id: property['@id'], 
					property: property, 
					value: this.model.get('configuration').values[property['@id']]
				});
				formEl.append(v.render().el);
				this.subviews.push(v);
			}

			return this;
		},

		onClickSave: function(event) {
			event.preventDefault();
			var config = new Config({
				id: 'id',
				cclass: {
					"@id": this.model.get('configurationClass')["@id"]
				},
				url: this.model.get('configuration')['@id']
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