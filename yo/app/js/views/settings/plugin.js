// Filename: views/dashboard
define([
	'jquery',
	'underscore',
	'backbone',
	'services/plugin',
	'i18n!nls/strings',
	'text!templates/settings/plugin.html'
], function($, _, Backbone, PluginService, strings, pluginTemplate) {

	return Backbone.View.extend({
		template: _.template(pluginTemplate),

		tagName: 'li',

		className: 'plugin',

		events: {
			'click #buttonSettings': 'onClickSettings',
			'click #buttonInstall': 'onClickInstall'
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				plugin: this.model.toJSON()
			}));

			return this;
		},

		reRender: function(plugin) {
			if (this.model.get('status').status !== plugin.get('status').status) {
				this.model = plugin;
				this.render();
			}
		},

		onClickSettings: function(event) {
			event.preventDefault();
			this.$el.trigger('pluginSettingsClick', this.model);
		},

		onClickInstall: function(event) {
			event.preventDefault();
			this.$el.trigger('pluginInstallClick', this.model);
		}
	});

});