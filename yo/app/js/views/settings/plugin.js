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
			'click #buttonSettings': 'onClickSettings'
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				plugin: this.model.toJSON()
			}));

			if (this.model.get('image')) {
				PluginService.getPluginIcon(this, this.model.get('image')['@id']).success(function(response, b, c) {
	                this.$el.find('.plugin-icon').html($('<img src="data:' + c.getResponseHeader('content-type') + ';base64,' + response + '" />'));
				});
			}

			return this;
		},

		onClickSettings: function(event) {
			event.preventDefault();
			this.$el.trigger('pluginSettingsClick', this.model);
		}
	});

});