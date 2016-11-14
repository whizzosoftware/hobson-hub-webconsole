// Filename: views/settings/plugin.js
define([
	'jquery',
	'underscore',
	'backbone',
	'smartmenus',
	'services/plugin',
	'services/action',
	'i18n!nls/strings',
	'text!templates/settings/plugin.html'
], function($, _, Backbone, smartmenus, PluginService, ActionService, strings, pluginTemplate) {

	return Backbone.View.extend({
		template: _.template(pluginTemplate),

		tagName: 'li',

		className: 'plugin',

		events: {
			'click #buttonSettings': 'onClickSettings',
			'click #buttonInstall': 'onClickInstall',
			'click #buttonUpdate': 'onClickUpdate',
			'click #buttonClose': 'onClickClose',
			'click .buttonAction': 'onClickAction'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			var plugin = this.model.toJSON();
			this.$el.html(this.template({
				strings: strings,
				plugin: plugin
			}));

			this.$el.find('#plugin-more-menu').smartmenus({
				subIndicatorsText: '<i class="fa fa-lg fa-ellipsis-v icon-button"></i>',
				hideOnClick: true,
				hideTimeout: 1000
			});

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
		},

		onClickUpdate: function(event) {
			event.preventDefault();
			this.$el.trigger('pluginUpdateClick', this.model);
		},

		onClickClose: function(event) {
			event.preventDefault();
			this.$el.find('.plugin-overlay').attr('hidden', true);
		},

		onClickAction: function(event) {
			event.preventDefault();
			this.$el.trigger('pluginActionClick', event.currentTarget.id);
		}

	});

});