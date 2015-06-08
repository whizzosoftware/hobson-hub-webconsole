// Filename: views/device/switch.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/switch.html'
], function($, _, Backbone, toastr, Variable, BaseStatusView, strings, template) {

	return BaseStatusView.extend({

		template: _.template(template),

		events: {
			'click #switchButton': 'onClick'
		},

		render: function(el) {
			var on = this.getVariable('on');
			if (on) {
				this.$el.html(this.template({
					strings: strings,
					device: this.model.toJSON(),
					variable: on,
					pending: this.showPending
				}));
			} else {
				this.$el.html('No "on" variable');
			}

			return this;
		},

		onClick: function() {
			if (!this.showPending) {
				var onVar = this.getVariable('on');
				if (onVar) {
					var newVal = !onVar.value;
					var v = new Variable({
						id: 'id', 
						url: onVar['@id'],
						value: newVal
					});
					v.save(null, {
						context: this,
						error: function(model, response, options) {
							if (response.status === 202) {
								options.context.setPendingUpdates({
									on: newVal
								});
							} else {
								toastr.error('Failed to update device variable');
							}
						}
					});
				}
			}
		}

	});

});