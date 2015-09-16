// Filename: views/deviceBootstrapsTable.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/settings/deviceBootstrap.html'
], function($, _, Backbone, strings, template) {

	return Backbone.View.extend({
		tagName: 'table',
		
		attributes: {
			width: '100%'
		},

		template: _.template(template),
		
		render: function() {
			this.$el.html('<thead><td>Device ID</td><td>Created</td><td>Bootstrapped</td></thead>');
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var bootstrap = this.model.at(i);
					this.$el.append(this.template({bootstrap: bootstrap}));
				}
			} else {
				this.$el.append('<tr><td class="text-center" style="padding: 25px;" colspan="4">No device bootstraps have been created.</td></tr>');
			}
			return this;
		}
	});

});