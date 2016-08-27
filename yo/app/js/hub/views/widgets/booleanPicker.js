// Filename: views/config/booleanPicker.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/plugin',
	'views/widgets/baseWidget',
	'i18n!nls/strings',
	'text!templates/widgets/booleanPicker.html'
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
				id: this.getSafeId(),
				property: this.model,
				required: this.required,
				value: this.value
			}));
			return this;
		},

		getValue: function() {
			return this.$el.find('input#' + this.getSafeId()).is(':checked');
		}

	});

});
