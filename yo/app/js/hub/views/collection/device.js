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
			this.selected = options.selected;
		},

		render: function() {
			this.$el.html(
				this.template({
					strings: strings,
					device: this.device.toJSON()
				})
			);

			if (this.selected) {
				this.$el.addClass('active');
			} else {
				this.$el.removeClass('active');
			}

			return this;
		},

		onClick: function(e) {
			e.preventDefault();
			this.selected = !this.selected;
			this.render();
			this.$el.trigger('deviceClicked', {device: this.device, selected: this.selected});
		}

	});

});
