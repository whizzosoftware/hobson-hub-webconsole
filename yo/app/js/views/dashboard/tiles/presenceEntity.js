// Filename: views/dashboard/tiles/presenceEntity.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'i18n!nls/strings',
	'text!templates/dashboard/tiles/presenceEntity.html'
], function($, _, Backbone, toastr, strings, template) {

	return Backbone.View.extend({
		tagName: 'div',

		template: _.template(template),

		className: "tile shadow-1",

		remove: function() {
			Backbone.View.prototype.remove.call(this);
		},

		close: function() {
		},

		render: function() {
			this.$el.html(this.template({ 
				entity: this.model.toJSON(), 
				strings: strings 
			}));
			return this;
		}

	});

});