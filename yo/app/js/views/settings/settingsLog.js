// Filename: views/settings/settingsLog.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'models/propertyContainer',
	'models/itemList',
	'models/logEntry',
	'views/settings/settingsTab',
	'views/settings/logTable',
	'i18n!nls/strings',
	'text!templates/settings/settingsLog.html'
], function($, _, Backbone, toastr, session, Config, ItemList, LogEntry, SettingsTab, LogTableView, strings, template) {

	var ProfileView = SettingsTab.extend({

		tabName: 'log',

		template: _.template(template),

		events: {
			'change input[type=radio]': 'onClickLogLevel',
			'click #saveButton': 'onClickSave'
		},

		initialize: function(options) {
			this.hub = options.hub;
			this.logLevel = this.model.get('values').logLevel;

			var logEntries = new ItemList({model: LogEntry, url: this.hub.get('log')['@id']});

			logEntries.fetch({
				context: this,
				success: function(model, response, options) {
					options.context.logTableView = new LogTableView({model: model});
					$('#log-table-container').append(options.context.logTableView.render().el);
				},
				error: function(model, response, options) {
					if (response.status === 200 || response.status === 206) {
						options.context.logTableView = new LogTableView({model: model});
						$('#log-table-container').append(options.context.logTableView.render().el);
					} else {
						toastr.error(strings.LogRetrievalError);
					}
				}
			});
		},

		remove: function() {
			this.logTableView.remove();
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				hub: this.hub,
				logLevel: this.logLevel
			}));
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

	return ProfileView;
});