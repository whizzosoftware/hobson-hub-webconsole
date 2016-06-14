// Filename: views/collection/devices.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/collection/device.html'
], function($, _, Backbone, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		className: 'device',

		template: _.template(template),

		events: {
			'click': 'onClick'
		},

		initialize: function(options) {
			this.device = options.device;
			this.value = options.value;
		},

		render: function() {
			this.$el.html(
				this.template({
					strings: strings,
					device: this.device.toJSON()
				})
			);

			if (this.isActive(this.device.get('@id'), this.value)) {
				this.$el.addClass('active');
			}

			return this;
		},

		onClick: function(e) {
			e.preventDefault();
			this.$el.trigger('deviceClicked', {device: this.device, el: this.$el});
		},

		isActive: function(deviceId, values) {
			for (var ix in values) {
				if (values[ix]['@id'] == deviceId) {
					return true;
				}
			}
			return false;
		}

	});

});
