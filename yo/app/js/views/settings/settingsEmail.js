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
			'keyup input#password': 'onPasswordChange',
			'click #testButton': 'onClickTest',
			'click #saveButton': 'onClickSave'
		},

		renderTabContent: function(el) {
			HubService.retrieveHubWithId(session.getSelectedHub().id, session.getHubsUrl(), {
				context: this,
				success: function(model, response, options) {
					var config = new Config({url: model.get('configuration')['@id']});
					config.fetch({
						context: options.context,
						success: function(model, response, options) {
							options.context.model = model;
							var config = model.get('values');
							el.html(options.context.template({
								strings: strings,
								config: config,
								hasServer: config.emailServer,
								hasGmailServer: config.emailServer === 'smtp.gmail.com',
								hasOtherServer: config.emailServer && config.emailServer !== 'smtp.gmail.com' && config.emailServer !== ''
							}));
							if (config.emailServer) {
								switch (config.emailServer) {
									case 'smtp.gmail.com':
										options.context.setServerType('serverGmail');
										break;
									default:
										options.context.setServerType('serverOther');
										break;
								}
							}
						},
						error: function(model, response, options) {
							toastr.error(strings.ErrorOccurred);
						}
					});
				}
			});
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

		onPasswordChange: function(e) {
			if (this.$el.find('#password').val().length > 0) {
				this.$el.find('#testButton').removeClass('disabled');
			} else {
				this.$el.find('#testButton').addClass('disabled');
			}
		},

		onClickServerType: function(e) {
			this.setServerType(e.target.id);
		},

		onClickTest: function(e) {
			e.preventDefault();

			if (!this.$el.find('#testButton').hasClass('disabled')) {
				this.enableTestButton(false, true);
	            var config = this.createEmailConfiguration();
				HubService.sendTestEmail(this, 'local', 'local', config).
	                fail(function(response) {
	                    if (response.status === 202) {
	                        toastr.success(strings.TestMessageSuccessful);
	                    } else {
	                        toastr.error(strings.TestMessageFailure);
	                    }
	                    this.enableTestButton(true);
	                }
	            );
	        }
		},

		enableTestButton: function(enable, showSpinner) {
			var el = this.$el.find('#testButton');
			if (showSpinner) {
				el.html('<i class="fa fa-spin fa-spinner"></i>&nbsp;' + strings.SendTestMessage);
			} else {
				el.text(strings.SendTestMessage);
			}
			if (enable && this.$el.find('#password').val().length > 0) {
				el.removeClass('disabled');
			} else {
				el.addClass('disabled');
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