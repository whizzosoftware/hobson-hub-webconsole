// Filename: views/settings/settingsPresence.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'models/propertyContainer',
	'models/itemList',
	'models/logEntry',
	'services/hub',
	'views/settings/settingsTab',
	'views/settings/peopleTable',
	'views/settings/locationsTable',
	'views/settings/addPerson',
	'views/settings/addLocation',
	'i18n!nls/strings',
	'text!templates/settings/settingsPresence.html'
], function($, _, Backbone, toastr, session, Config, ItemList, LogEntry, HubService, SettingsTab, PeopleTableView, LocationsTableView, AddPersonView, AddLocationView, strings, template) {

	return SettingsTab.extend({

		tabName: 'presence',

		template: _.template(template),

		events: {
			'click #add-person-button': 'onAddPersonButton',
			'click #add-location-button': 'onAddLocationButton',
			'entityDeleted': 'render'
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

			HubService.getPresenceEntities(this,
				function(model, response, options) {
					options.context.peopleTableView = new PeopleTableView({model: model});
					options.context.$el.find('#people-table-container').html(options.context.peopleTableView.render().el);
				}, 
				function(model, response, options) {
					toastr.error(strings.PersonRetrieveError);
				}
			);

			HubService.getLocations(this,
				function(model, response, options) {
					options.context.locationsTableView = new LocationsTableView({model: model});
					options.context.$el.find('#locations-table-container').html(options.context.locationsTableView.render().el);
				},
				function(model, response, options) {
					toastr.error(strings.LocationRetrieveError);
				}
			);
		},

		onAddPersonButton: function() {
			var el = this.$el.find('#add-person-modal');
			el.html(new AddPersonView().render().el);
			el.foundation('reveal', 'open');
		},

		onAddLocationButton: function() {
			var el = this.$el.find('#add-location-modal');
			el.html(new AddLocationView().render().el);
			el.foundation('reveal', 'open');
		},

		onRevealClosed: function() {
			this.render();
		}

	});

});