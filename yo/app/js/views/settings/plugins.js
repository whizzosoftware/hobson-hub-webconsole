// Filename: views/plugins.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/settings/plugin',
	'i18n!nls/strings'
], function($, _, Backbone, PluginView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: 'plugins small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		subviews: {},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			var p;
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var plugin = this.model[i];
					var pluginView = new PluginView({model: plugin});
					var rv = pluginView.render().el;
					this.$el.append(rv);
					this.subviews[plugin.get('@id')] = pluginView;
				}
			} else {
				this.$el.html('<p class="notice">There are no new plugins currently available.</p>');
			}

			return this;
		},

		reRender: function(plugins) {
			for (var ix=0; ix < plugins.length; ix++) {
				var plugin = plugins.at(ix);
				var view = this.subviews[plugin.get('@id')];
				if (view) {
					view.reRender(plugin);
				}
			}
		}

	});

});