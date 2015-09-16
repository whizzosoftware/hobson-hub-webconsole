// Filename: views/settings/settingsAdvanced.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'models/propertyContainer',
	'models/itemList',
	'models/logEntry',
	'services/device',
	'views/settings/settingsTab',
	'views/settings/deviceBootstrapsTable',
	'views/settings/addDeviceBootstrap',
	'i18n!nls/strings',
	'text!templates/settings/settingsAdvanced.html'
], function($, _, Backbone, toastr, session, Config, ItemList, LogEntry, DeviceService, SettingsTab, DeviceBootstrapsTableView, AddDeviceBootstrapView, strings, template) {

	return SettingsTab.extend({

		tabName: 'advanced',

		template: _.template(template),

		events: {
			'click #add-button': 'onAddButton'
		},

		initialize: function(options) {
			$(document).on('closed.fndtn.reveal', '[data-reveal]', $.proxy(function(e) {
				this.onRevealClosed();
			}, this));
		},

		remove: function() {
			$(document).off('closed.fndtn.reveal');
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				hub: this.hub
			}));

			DeviceService.getDeviceBootstraps(this, '/api/v1/users/local/hubs/local/deviceBootstraps?expand=item', 
				function(model, response, options) {
					options.context.bootstrapTableView = new DeviceBootstrapsTableView({model: model});
					$('#bootstrap-table-container').append(options.context.bootstrapTableView.render().el);
				}, 
				function(model, response, options) {
					console.debug('error: ', response);
				}
			);
		},

		onAddButton: function() {
			var el = this.$el.find('#add-bootstrap-modal');
			el.html(new AddDeviceBootstrapView().render().el);
			el.foundation('reveal', 'open');
		},

		onRevealClosed: function() {
			console.log('reveal closed');
			console.debug(this);
			this.render();
		}

	});

});