// Filename: views/dashboard/tiles/unknown.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
  'views/devices/tiles/tile',
	'i18n!nls/strings',
	'text!templates/devices/tiles/unknown.html'
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

		render: function() {
			this.$el.html(this.template({
				device: this.model.toJSON(),
				available: this.available,
				on: this.model.isOn(),
				strings: strings
			}));
			return this;
		},

    updateState: function() {
    },

		onButtonClick: function() {
			this.$el.trigger('deviceButtonClick', this.model);
		}

  });

});
