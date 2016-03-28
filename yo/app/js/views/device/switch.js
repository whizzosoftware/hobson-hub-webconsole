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
], function($, _, Backbone, toastr, Variable, BaseStatus, strings, template) {

	return BaseStatus.extend({

		template: _.template(template),

		events: {
			'click #switchToggle': 'onClick',
		},

		render: function(el) {
			this.$el.html(this.template({
				strings: strings,
				device: this.model.toJSON(),
				variables: this.variables,
				pending: this.showPending,
				levelSliderVal: null,
				color: null
			}));

			return this;
		},

		onClick: function() {
			if (!this.hasPendingUpdates()) {
				var onVar = this.getVariable('on');
				this.setVariableValues({on: !onVar.value});
				this.pendingUpdate = true;
				this.showSpinner(true);
			} else {
				return false;
			}
		},

		onVariableUpdate: function(name) {
			this.showSpinner(false);
		},

		onVariableFailure: function() {
			toastr.error('Failed to update device state');
			this.showSpinner(false, function() {
				this.render();
			}.bind(this));
		},

		onVariableTimeout: function() {
			toastr.error('Failed to update device state');
			this.showSpinner(false, function() {
				this.render();
			}.bind(this));
		},

		showSpinner: function(show, callback) {
			if (show) {
				this.$el.find('#spinner').animate({'opacity': 1}, callback);
			} else {
				this.$el.find('#spinner').animate({'opacity': 0}, callback);
			}
		}

	});

});