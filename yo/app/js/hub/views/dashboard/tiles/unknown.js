// Filename: views/dashboard/tiles/unknown.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
  'views/dashboard/tiles/tile',
	'i18n!nls/strings',
	'text!templates/dashboard/tiles/unknown.html'
], function($, _, Backbone, toastr, DeviceService, TileView, strings, template) {

	return TileView.extend({
		tagName: 'div',

		template: _.template(template),

		className: "tile shadow-1",

		events: {
			'click #tileButton': 'onButtonClick'
		},

		remove: function() {
			Backbone.View.prototype.remove.call(this);
		},

		close: function() {
			clearInterval(this.time);
		},

		render: function() {
			this.$el.html(this.template({
				device: this.model.toJSON(),
				available: this.available,
				on: this.model.isOn(),
				strings: strings
			}));
			return this;
		},

		onButtonClick: function() {
			this.$el.trigger('deviceButtonClick', this.model);
		}
	});

});
