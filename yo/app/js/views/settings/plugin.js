// Filename: views/dashboard
define([
	'jquery',
	'underscore',
	'backbone',
	'services/plugin',
	'i18n!nls/strings',
	'text!templates/settings/plugin.html'
], function($, _, Backbone, PluginService, strings, pluginTemplate) {

	var PluginView = Backbone.View.extend({
		template: _.template(pluginTemplate),

		tagName: 'li',

		className: 'plugin',

		events: {
			'click #button-settings': 'onClickSettings'
		},

		initialize: function(plugin) {
			this.plugin = plugin;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				plugin: this.plugin.toJSON()
			}));

			var links = this.plugin.get('links');
			if (links) {
				PluginService.getPluginIcon(this, links.icon).success(function(response, b, c) {
	                this.$el.find('.plugin-icon').html($('<img src="data:' + c.getResponseHeader('content-type') + ';base64,' + response + '" />'));
				});
			}

			return this;
		},

		onClickSettings: function(event) {
			event.preventDefault();
			this.$el.trigger('pluginSettingsClick', this.plugin);
		}
	});

	return PluginView;
});