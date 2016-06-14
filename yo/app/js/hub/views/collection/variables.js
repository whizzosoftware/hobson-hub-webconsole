// Filename: views/collection/variables.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/collection/variable',
	'i18n!nls/strings'
], function($, _, Backbone, VariableView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		initialize: function(options) {
			this.variables = options.variables;
			this.value = options.value;
			this.subviews = [];
		},

		remove: function() {
			for (var i=0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html('');
			for (var i=0; i < this.variables.length; i++) {
				var variable = this.variables.at(i);
				var v = new VariableView({variable: variable, value: this.value});
				this.$el.append(v.render().el);
				this.subviews.push(v);
			}
			return this;
		}

	});

});