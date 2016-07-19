// Filename: views/data/dataStreamVariables.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/data/dataStreamVariable',
	'i18n!nls/strings'
], function($, _, Backbone, DataStreamVariableView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: 'panelList',

		initialize: function(options) {
			this.subviews = [];
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var variableView = new DataStreamVariableView({
						model: this.model[i]
					});
					var rv = variableView.render().el;
					this.$el.append(rv);
					this.subviews.push(variableView);
				}
			} else {
 				this.$el.html('<p class="notice">' + strings.DataStreamHelpText + '</p>');
			}

			return this;
		}

	});

});
