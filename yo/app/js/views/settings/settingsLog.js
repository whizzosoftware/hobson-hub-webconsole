// Filename: views/settings/settingsLog.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/session',
	'models/hub',
	'models/logEntries',
	'views/settings/settingsTab',
	'views/settings/logTable',
	'i18n!nls/strings',
	'text!templates/settings/settingsLog.html'
], function($, _, Backbone, toastr, session, Hub, LogEntries, SettingsTab, LogTableView, strings, template) {

	var ProfileView = SettingsTab.extend({

		tabName: 'log',

		template: _.template(template),

		events: {
			'change input[type=radio]': 'onClickLogLevel',
			'click #saveButton': 'onClickSave'
		},

		initialize: function(options) {
			this.hub = options.hub;

			var logEntries = new LogEntries('/api/v1/users/local/hubs/local/log');
			logEntries.fetch({
				context: this,
				success: function(model, response, options) {
					options.context.logTableView = new LogTableView(logEntries);
					$('#log-table-container').append(options.context.logTableView.render().el);
				},
				error: function(model, response, options) {
					if (response.status === 206) {
						options.context.logTableView = new LogTableView(logEntries);
						$('#log-table-container').append(logTableView.render().el);
					} else {
						console.debug('nope!');
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
				logLevel: this.hub.get('logLevel')
			}));
		},

		onClickLogLevel: function(e) {
			console.debug('log level: ', e.target.id);
			this.logLevel = e.target.id;
		},

		onClickSave: function(e) {
			e.preventDefault();

            var hub = new Hub({ 
        		id: this.hub.id, 
        		logLevel: this.logLevel,
        		url: session.getSelectedHubUrl()
        	});

            console.debug('saving model: ', hub.toJSON());

            hub.save(null, {
                context: this,
                error: function(model, response, options) {
                    if (response.status == 202) {
                    	toastr.success('Log configuration saved.');
                    } else {
                        toastr.error('Log configuration was not saved. See the log file for details.');
                    }
                }
            });
		}		

	});

	return ProfileView;
});