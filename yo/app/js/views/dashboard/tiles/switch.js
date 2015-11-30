// Filename: views/dashboard/tiles/switch.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'services/polling',
	'i18n!nls/strings',
	'text!templates/dashboard/tiles/switch.html'
], function($, _, Backbone, toastr, DeviceService, PollingService, strings, template) {

	return Backbone.View.extend({
		tagName: 'div',

		template: _.template(template),

		className: "tile shadow-1",

		events: {
			'click #tileIcon': 'onIconClick',
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
				available: DeviceService.isDeviceAvailable(this.model),
				on: this.model.isOn(), 
				strings: strings 
			}));
			return this;
		},

		onIconClick: function() {
			var prefVar = this.model.get('preferredVariable');
			var newValue = null;
			if (prefVar) {
				switch (prefVar.name) {
					case 'on':
						newValue = !prefVar.value;
						DeviceService.setDeviceVariable(prefVar["@id"], newValue);
						break;
				}
			}

			// if a new variable value was set, poll to detect when the change is applied
			if (newValue !== null) {
				// show the user a wait spinner
				this.showSpinner(true);

				// kick off the variable URL polling
				PollingService.poll({
					context: this,
					url: prefVar["@id"],
					interval: 1000,
					check: function(ctx, json) {
						return (json.value === newValue);
					},
					success: function(ctx) {
						ctx.showSpinner(false);
						ctx.$el.find('#work-icon').css('display', 'none');
						ctx.model.setPreferredVariableValue(newValue);
						ctx.render();
					},
					failure: function(ctx) {
						ctx.showSpinner(false);
						toastr.error('Unable to confirm device was updated');
					}
				});
			}
		},

		onButtonClick: function() {
			this.$el.trigger('deviceButtonClick', this.model);
		},

		showSpinner: function(enabled) {
			this.$el.find('#work-icon').css('display', enabled ? 'block' : 'none');
		}
	});

});