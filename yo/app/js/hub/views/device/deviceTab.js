// Filename: views/device/deviceTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'services/action',
	'models/session',
	'models/hubs',
	'models/actionClass',
	'views/action/actionExecutionDialog',
	'views/device/deviceSettingsDialog',
	'i18n!nls/strings',
	'text!templates/device/deviceTabs.html'
], function($, _, Backbone, toastr, DeviceService, ActionService, session, Hubs, ActionClass, ActionExecutionDialogView, DeviceSettingsDialogView, strings, tabsTemplate) {

	return Backbone.View.extend({

		events: {
			'click #editName': 'onEditName',
			'click #saveName': 'onSaveName',
			'click #cancelName': 'onCancelName',
			'click #deviceSettings': 'onDeviceSettings',
			'click #deleteDevice': 'onDeleteDevice',
			'click a.actionItem': 'onAction'
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

			// create menu
			var el = this.$el.find('#mainMenuItems');

			// add settings item
			if (this.model.has('cclass') && this.model.get('cclass').supportedProperties) {
				el.append('<li><a id="deviceSettings"><i class="fa fa-cog"></i>&nbsp;Settings</a></li>');
			}

			// add any action classes
			if (this.model.has('actionClasses')) {
				var ac = this.model.get('actionClasses');
				for (var i=0; i < ac.numberOfItems; i++) {
					var item = ac.itemListElement[i].item;
					el.append('<li><a class="actionItem" id="' + item['@id'] + '"><i class="fa fa-wrench"></i>&nbsp;' + item.name + '</a></li>');
				}
			}

			// add delete device
			el.append('<li><a id="deleteDevice"><i class="fa fa-close"></i>&nbsp;Delete This Device</a></li>');

			this.$el.find('#mainMenu').smartmenus({
				subIndicatorsText: '<i class="fa fa-lg fa-ellipsis-v"></i>',
				hideOnClick: true,
				hideTimeout: 500
			});

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

		onAction: function(e) {
			e.preventDefault();
			var ac = this.model.getActionClass(e.currentTarget.id);
			var el = this.$el.find('#device-config-modal');
			el.html(new ActionExecutionDialogView({model: ac}).render().el);
			el.foundation('reveal', 'open');
		},

		onDeviceSettings: function(e) {
			e.preventDefault();
			var el = this.$el.find('#device-config-modal');
			el.html(new DeviceSettingsDialogView({model: this.model}).render().el);
			el.foundation('reveal', 'open');
		},

		onDeleteDevice: function(e) {
	      if (confirm(strings.AreYouSureYouWantToDelete + ' \"' + this.model.get('name') + '\"?')) {
	      		DeviceService.deleteDevice(this.model.get('@id'), function(model, response, options) {
	      			console.log('delete happened');
	      			toastr.success(strings.DeviceDeleted);
					Backbone.history.navigate('devices', {trigger: true});
	      		}.bind(this), function(model, response, options) {
					toastr.error(strings.ErrorOccurred);
	      			console.log('Error deleting device', model, response, options);
	      		}.bind(this));
	      }
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
