// Filename: views/account/hubs.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/account/hub',
	'i18n!nls/strings',
], function($, _, Backbone, HubView, strings) {

	var HubsView = Backbone.View.extend({

		tagName: 'table',

		attributes: {
			width: '100%'
		},

		subviews: [],

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html('<thead><td>Name</td><td>Access Key</td></thead>');

			for (var i = 0; i < this.model.length; i++) {
				var hub = this.model.at(i);
				if (hub) {
					var hubView = new HubView({ 
						model: hub 
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