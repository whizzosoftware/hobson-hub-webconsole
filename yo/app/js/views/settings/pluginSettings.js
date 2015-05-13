// Filename: views/pluginConfig
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/config',
	'views/configProperty',
	'i18n!nls/strings',
	'text!templates/settings/pluginSettings.html'
], function($, _, Backbone, toastr, Config, ConfigPropertyView, strings, pluginSettingsTemplate) {

	var PluginConfigView = Backbone.View.extend({

		template: _.template(pluginSettingsTemplate),

		events: {
			'click #saveButton': 'onClickSave',
			'click #cancelButton': 'onClickCancel'
		},

		subviews: [],

		initialize: function(options) {
			this.plugin = options.plugin;
			this.pluginConfig = options.pluginConfig;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				plugin: this.plugin.toJSON()
			}));

			var formEl = this.$el.find('form');

			var properties = this.pluginConfig.get('properties');
			for (var property in properties) {
				var v = new ConfigPropertyView({id: property, property: properties[property]});
				formEl.append(v.render().el);
				this.subviews.push(v);
			}

			return this;
		},

		onClickSave: function(event) {
			event.preventDefault();
			console.debug(this.pluginConfig.url);
			var config = new Config(this.pluginConfig.url);
			for (var i=0; i < this.subviews.length; i++) {
				var v = this.subviews[i];
				config.setProperty(v.getId(), v.getValue());
			}
			config.set('id', this.plugin.get('id'));
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
		},

		onClickCancel: function(event) {
			event.preventDefault();
			this.$el.foundation('reveal', 'close');
		}

	});

	return PluginConfigView;
});