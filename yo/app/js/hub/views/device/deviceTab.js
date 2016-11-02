// Filename: views/device/deviceTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'models/session',
	'models/hubs',
	'i18n!nls/strings',
	'text!templates/device/deviceTabs.html'
], function($, _, Backbone, toastr, DeviceService, session, Hubs, strings, tabsTemplate) {

	return Backbone.View.extend({

		events: {
			'click #editName': 'onEditName',
			'click #saveName': 'onSaveName',
			'click #cancelName': 'onCancelName'
		},

		tabsTemplate: _.template(tabsTemplate),

		subviews: [],

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			// render tabs
			this.$el.html(
				this.tabsTemplate({
					strings: strings,
					device: this.model.toJSON(),
					deviceUri: encodeURIComponent(this.model.get('@id')),
					tabName: this.tabName,
					showNameEdit: this.model.get('links') && this.model.get('links').setName
				})
			);

			this.renderTabContent(this.$el.find('.content'));

			return this;
		},

		onEditName: function() {
			this.showUpdateMode(this.$el.find('#display'), this.$el.find('#edit'));
		},

		onSaveName: function(e) {
			e.preventDefault();
			var el = $(e.currentTarget);
			if (!el.hasClass('disabled')) {
				var deviceNameFieldEl = this.$el.find('#deviceNameField');
				var newDeviceName = deviceNameFieldEl.val();
				var deviceNameEl = this.$el.find('#deviceName');
				var displayEl = this.$el.find('#display');
				var editEl = this.$el.find('#edit');

				this.showUpdateInProgress(el, displayEl, editEl, deviceNameFieldEl);

				DeviceService.setDeviceName(this, this.model.get('links').setName, newDeviceName, function(ctx) {
					deviceNameEl.html(newDeviceName);
					ctx.hideUpdateMode(el, displayEl, editEl, deviceNameFieldEl);
				}, function() {
					toastr.error(strings.ErrorUpdatingDeviceName);
					ctx.hideUpdateMode(el, displayEl, editEl, deviceNameFieldEl);
				});
			}
		},

		onCancelName: function(e) {
			e.preventDefault();
			this.hideUpdateMode(this.$el.find('#saveName'), this.$el.find('#display'), this.$el.find('#edit'), this.$el.find('#deviceNameField'));
		},

		showUpdateMode: function(displayEl, editEl) {
			displayEl.css('display', 'none');
			editEl.css('display', 'block').focus();
		},

		showUpdateInProgress: function(buttonEl, displayEl, editEl, deviceNameFieldEl) {
			buttonEl.html('<i class="fa fa-spinner fa-spin"></i>');
			buttonEl.addClass('disabled');
			deviceNameFieldEl.prop('disabled', true);
		},

		hideUpdateMode: function(buttonEl, displayEl, editEl, deviceNameFieldEl) {
			buttonEl.html(strings.Save);
			buttonEl.removeClass('disabled');
			displayEl.css('display', 'block');
			deviceNameFieldEl.prop('disabled', false);
			editEl.css('display', 'none');
		}

	});

});