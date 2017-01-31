// Filename: views/settings/settingsLog.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'models/session',
	'models/propertyContainer',
	'models/itemList',
	'models/logEntry',
	'views/settings/settingsTab',
	'views/settings/logTable',
	'i18n!nls/strings',
	'text!templates/settings/settingsLog.html'
], function($, _, Backbone, toastr, HubService, session, Config, ItemList, LogEntry, SettingsTab, LogTableView, strings, template) {

	return SettingsTab.extend({

		tabName: 'log',

		template: _.template(template),

		events: {
			'change input[type=radio]': 'onClickLogLevel',
			'click #saveButton': 'onClickSave'
		},

		remove: function() {
			this.logTableView.remove();
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var hub = model;
					var config = new Config({url: hub.get('configuration')['@id']});
					config.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.model = model;

							// render log container
							el.html(options.context.template({
								strings: strings,
								hub: hub,
								logLevel: model.get('values').logLevel
							}));

							// render log entries
							HubService.getLogEntries(
								options.context,
								function(model, response, options) {
									el.find('#loading').remove();
									options.context.logTableView = new LogTableView({model: model});
									$('#log-table-container').append(options.context.logTableView.render().el);
								},
								function(model, response, options) {
                  el.find('#loading').remove();
									if (response.status === 200 || response.status === 206) {
										options.context.logTableView = new LogTableView({model: model});
										$('#log-table-container').append(options.context.logTableView.render().el);
									} else {
										toastr.error(strings.LogRetrievalError);
									}
								}
							);
						},
						error: function(model, response, options) {
							toastr.error(strings.ErrorOccurred);
						}
					});
				}
			});
		},

		onClickLogLevel: function(e) {
			this.logLevel = e.target.id;
		},

		onClickSave: function(e) {
			e.preventDefault();

      var config = new Config({id: 'id', url: this.model.get('@id'), cclass: this.model.get('cclass')});
      config.setProperty('logLevel', this.logLevel);

      config.save(null, {
          context: this,
          error: function(model, response, options) {
              if (response.status == 202) {
                toastr.success(strings.LogConfigurationSaved);
              } else {
                  toastr.error(strings.LogConfigurationSaveError);
              }
          }
      });
		}

	});

});
