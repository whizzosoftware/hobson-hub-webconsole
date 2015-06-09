// Filename: views/configProperty.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/plugin',
	'i18n!nls/strings',
	'text!templates/configProperty.html'
], function($, _, Backbone, PluginService, strings, pluginConfigTemplate) {

	var ConfigPropertyView = Backbone.View.extend({

		template: _.template(pluginConfigTemplate),

		initialize: function(options) {
			this.id = options.id;
			this.property = options.property;
			this.value = options.value;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				id: this.id,
				property: this.property,
				value: this.value
			}));
			return this;
		},

		getId: function() {
			return this.id;
		},

		getValue: function() {
			return this.$el.find('input').val();
		}

	});

	return ConfigPropertyView;
});