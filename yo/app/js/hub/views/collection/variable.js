// Filename: views/collection/variable.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/collection/variable.html'
], function($, _, Backbone, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		className: 'device',

		template: _.template(template),

		events: {
			'click': 'onClick'
		},

		initialize: function(options) {
			this.variable = options.variable;
			this.value = options.value;
		},

		render: function() {
			this.$el.html(
				this.template({
					strings: strings,
					variable: this.variable.toJSON()
				})
			);

			if (this.isActive(this.variable.get('@id'), this.value)) {
				this.$el.addClass('active');
			}

			return this;
		},

		onClick: function(e) {
			e.preventDefault();
			this.$el.trigger('variableClicked', {variable: this.variable, el: this.$el});
		},

		isActive: function(variableId, values) {
			for (var ix in values) {
				if (values[ix]['@id'] == variableId) {
					return true;
				}
			}
			return false;
		}

	});

});
