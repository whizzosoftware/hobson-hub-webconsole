// Filename: views/dashboard/tiles/lightbulb.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
  'services/event',
  'views/devices/tiles/tile',
	'i18n!nls/strings',
	'text!templates/devices/tiles/lightbulb.html'
], function($, _, Backbone, toastr, DeviceService, EventService, TileView, strings, template) {

	return TileView.extend({
		tagName: 'div',

		template: _.template(template),

		className: "tile shadow-1",

		events: {
			'click #tileIcon': 'onIconClick',
			'click #tileButton': 'onButtonClick'
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

		onIconClick: function() {
			var prefVar = this.model.get('preferredVariable');
			var newValue = null;
			if (prefVar.name === 'on') {
				newValue = !prefVar.value;
				DeviceService.setDeviceVariable(prefVar["@id"], newValue);
				this.firePreferredVariableUpdate();
			}
		},

		onButtonClick: function() {
			this.$el.trigger('deviceButtonClick', this.model);
		}

	});

});
