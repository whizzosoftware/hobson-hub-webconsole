// Filename: views/dashboard/tiles/weatherStation.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'services/polling',
	'i18n!nls/strings',
	'text!templates/dashboard/tiles/weatherStation.html'
], function($, _, Backbone, toastr, DeviceService, PollingService, strings, template) {

	return Backbone.View.extend({
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
			this.$el.html(this.template({ device: this.model.toJSON(), on: this.model.isOn(), strings: strings }));
			return this;
		},

		reRender: function(device) {
			this.model = device;
			this.render();
		},

		onButtonClick: function() {
			this.$el.trigger('deviceButtonClick', this.model);
		}
	});

});