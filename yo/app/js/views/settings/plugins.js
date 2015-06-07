// Filename: views/plugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/settings/plugin',
	'i18n!nls/strings'
], function($, _, Backbone, PluginView, strings) {

	return Backbone.View.extend({
		subviews: [],

		tagName: 'ul',

		className: 'plugins small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			var p;
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var pluginView = new PluginView({model: this.model[i]});
					var rv = pluginView.render().el;
					this.$el.append(rv);
					this.subviews.push(pluginView);
				}
			} else {
				this.$el.html('<p class="notice">There are no new plugins currently available.</p>');
			}

			return this;
		}

	});

});