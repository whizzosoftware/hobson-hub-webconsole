// Filename: views/account/hubs.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/account/hub',
	'i18n!nls/strings',
], function($, _, Backbone, HubView, strings) {

	var HubsView = Backbone.View.extend({

		tagName: 'ul',

		subviews: [],

		initialize: function(options) {
			this.hubs = options.hubs;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			for (var i = 0; i < this.hubs.length; i++) {
				var hub = this.hubs.at(i);
				if (hub) {
					var hubView = new HubView({ 
						hub: hub 
					});
					this.$el.append(hubView.render().el);
					this.subviews.push(hubView);
				}
			}
			return this;
		}		

	});

	return HubsView;
});