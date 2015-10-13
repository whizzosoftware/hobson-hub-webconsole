// Filename: views/config/stringPicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/plugin',
	'views/widgets/baseWidget',
	'i18n!nls/strings',
	'text!templates/widgets/stringPicker.html'
], function($, _, Backbone, PluginService, BaseWidget, strings, pluginConfigTemplate) {

	return BaseWidget.extend({

		template: _.template(pluginConfigTemplate),

		initialize: function(options) {
			this.required = this.model && this.model.constraints ? this.model.constraints.required : false;
			this.value = options.value;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				id: this.getId(),
				property: this.model,
				required: this.required,
				value: this.value
			}));
			return this;
		}

	});

});
