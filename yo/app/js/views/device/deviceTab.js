// Filename: views/device/deviceTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'models/hubs',
	'i18n!nls/strings',
	'text!templates/device/deviceTabs.html'
], function($, _, Backbone, session, Hubs, strings, tabsTemplate) {

	return Backbone.View.extend({

		tabsTemplate: _.template(tabsTemplate),

		subviews: [],

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			// render tabs
			this.$el.html(
				this.tabsTemplate({
					strings: strings,
					device: this.device.toJSON(),
					deviceUri: encodeURIComponent(this.device.get('links').self),
					tabName: this.tabName
				})
			);

			this.renderTabContent(this.$el.find('.content'));

			return this;
		}

	});

});