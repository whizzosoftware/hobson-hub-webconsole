// Filename: views/settings/settingsGeneral.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'models/session',
	'models/propertyContainer',
	'models/emailConfig',
	'views/settings/settingsTab',
	'i18n!nls/strings',
	'text!templates/settings/settingsEmail.html'
], function($, _, Backbone, toastr, HubService, session, Config, EmailConfiguration, SettingsTab, strings, template) {

	var ProfileView = SettingsTab.extend({

		tabName: 'email',

		template: _.template(template),

		serverType: 'serverNone',

		events: {
			'change input[type=radio]': 'onClickServerType',
			'click #testButton': 'onClickTest',
			'click #saveButton': 'onClickSave'
		},

		renderTabContent: function(el) {
			var config = this.model.get('values');

			el.html(this.template({
				strings: strings,
				config: config,
				hasServer: config.emailServer,
				hasGmailServer: config.emailServer === 'smtp.gmail.com',
				hasOtherServer: config.emailServer && config.emailServer !== 'smtp.gmail.com' && config.emailServer !== ''
			}));

			if (config.emailServer) {
				switch (config.emailServer) {
					case 'smtp.gmail.com':
						this.setServerType('serverGmail');
						break;
					default:
						this.setServerType('serverOther');
						break;
				}
			}
		},

		enableForm: function(enabled) {
			this.$el.find('#server').prop('disabled', !enabled);
			this.$el.find('#username').prop('disabled', !enabled);
			this.$el.find('#password').prop('disabled', !enabled);
			this.$el.find('#secure').prop('disabled', !enabled);
			this.$el.find('#senderAddress').prop('disabled', !enabled);
		},

		createEmailConfiguration: function(url) {
            var c = new Config({id: 'id', url: url, cclass: this.model.get('cclass')});
            var e = this.serverType !== 'serverNone';

            c.setProperty('emailServer', e ? this.$el.find('#server').val() : '');
            c.setProperty('emailSecure', e ? this.$el.find('#secure').prop('checked'): false);
            c.setProperty('emailUsername', e ? this.$el.find('#username').val() : '');
            c.setProperty('emailSender', e ? this.$el.find('#senderAddress').val() : '');
            var pwd = this.$el.find('#password').val();
            if (pwd && pwd !== '' && e) {
	            c.setProperty('emailPassword', pwd);
	        }
            return c;
		},

		setServerType: function(type) {
			this.serverType = type;
			this.enableForm(type !== 'serverNone');
			if (type === 'serverGmail') {
				this.$el.find('#server').val('smtp.gmail.com');
				this.$el.find('#secure').prop('checked', true);
			}
		},

		onClickServerType: function(e) {
			this.setServerType(e.target.id);
		},

		onClickTest: function(e) {
			e.preventDefault();

            var config = this.createEmailConfiguration();
            var error = config.validate();
            if (error) {
            	toastr.error(error);
            } else {
				HubService.sendTestEmail('local', 'local', config).
                    fail(function(response) {
                        if (response.status === 202) {
                            toastr.success(strings.TestMessageSuccessful);
                        } else {
                            toastr.error(strings.TestMessageFailure);
                        }
                    }
                );            	
            }
		},

		onClickSave: function(e) {
			e.preventDefault();

            var config = this.createEmailConfiguration(this.model.get('@id'));
            config.save(null, {
                context: this,
                error: function(model, response, options) {
                    if (response.status == 202) {
                    	toastr.success('E-mail configuration saved.');
                    } else {
                        toastr.error('E-mail configuration was not saved. See the log file for details.');
                    }
                }
            });
		}		

	});

	return ProfileView;
});