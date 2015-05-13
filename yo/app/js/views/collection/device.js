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
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					device: this.device.toJSON()
				})
			);

			return this;
		},

		onClick: function(e) {
			e.preventDefault();
			var selected = !this.$el.hasClass('active');
			if (selected) {
				this.$el.addClass('active');
			} else {
				this.$el.removeClass('active');
			}
			this.$el.trigger('deviceSelected', {device: this.device, selected: selected});
		}

	});

});