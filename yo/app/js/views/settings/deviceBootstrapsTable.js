// Filename: views/deviceBootstrapsTable.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'views/settings/deviceBootstrap',
	'i18n!nls/strings'
], function($, _, Backbone, toastr, DeviceService, DeviceBootstrapView, strings) {

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
			this.$el.html('<thead><td>Device ID</td><td>Created</td><td>Bootstrapped</td><td></td></thead>');
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var v = new DeviceBootstrapView({model: this.model.at(i)});
					this.$el.append(v.render().el);
					this.subviews.push(v);
				}
			} else {
				this.$el.append('<tr><td class="text-center" style="padding: 25px;" colspan="5">No device bootstraps have been created.</td></tr>');
			}
			return this;
		},

		onResetClick: function(e, bootstrap) {
			e.preventDefault();
			DeviceService.resetDeviceBootstrap(this, bootstrap.get('@id'))
				.success(function(response) {
					console.debug('success');
					toastr.success('Device bootstrap reset.');
				}).fail(function(response) {
					console.debug('fail');
					toastr.error('Error resetting device bootstrap. See the log for details.');
				});
		},

		onDeleteClick: function(e, bootstrap) {
			e.preventDefault();
			DeviceService.deleteDeviceBootstrap(this, bootstrap.get('@id'))
				.success(function(response) {
					toastr.success('Device bootstrap deleted.');
				}).fail(function(response) {
					toastr.error('Error deleting device bootstrap. See the log for details.');
				});
		}

	});

});