// Filename: views/devicePassportsTable.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'views/settings/devicePassport',
	'i18n!nls/strings'
], function($, _, Backbone, toastr, DeviceService, DevicePassportView, strings) {

	return Backbone.View.extend({
		tagName: 'table',

		attributes: {
			width: '100%'
		},

		events: {
			'resetClick': 'onResetClick',
			'deleteClick': 'onDeleteClick'
		},

		initialize: function() {
			this.subviews = [];
		},

		remove: function() {
			for (var i=0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html('<thead><td width="10"></td><td>' + strings.DeviceId + '</td><td>' + strings.Created + '</td><td>' + strings.Activated + '</td><td></td></thead>');
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var v = new DevicePassportView({model: this.model.at(i)});
					this.$el.append(v.render().el);
					this.subviews.push(v);
				}
			} else {
				this.$el.append('<tr><td class="text-center" style="padding: 25px;" colspan="6">' + strings.NoDevicePassports + '</td></tr>');
			}
			return this;
		},

		onResetClick: function(e, passport) {
			e.preventDefault();
			DeviceService.resetDevicePassport(this, passport.get('@id'))
				.success(function(response) {
					toastr.success(strings.DevicePassportReset);
				}).fail(function(response) {
					toastr.error(strings.DevicePassportResetError);
				});
		},

		onDeleteClick: function(e, passport) {
			e.preventDefault();
			DeviceService.deleteDevicePassport(this, passport.get('@id'))
				.success(function(response) {
					toastr.success(strings.DevicePassportDeleted);
				}).fail(function(response) {
					toastr.error(strings.DevicePassportDeletedError);
				});
		}

	});

});
