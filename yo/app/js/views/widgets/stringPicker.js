// Filename: views/config/stringProperty.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/plugin',
	'i18n!nls/strings',
	'text!templates/widgets/stringPicker.html'
], function($, _, Backbone, PluginService, strings, pluginConfigTemplate) {

	return Backbone.View.extend({

		template: _.template(pluginConfigTemplate),

		initialize: function(options) {
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
			return this.property['@id'];
		},

		getValue: function() {
			return this.$el.find('input').val();
		}

	});

});
