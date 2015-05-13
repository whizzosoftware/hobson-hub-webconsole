// Filename: views/settings/settingsGeneral.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'models/session',
	'models/hub',
	'models/emailConfig',
	'views/settings/settingsTab',
	'i18n!nls/strings',
	'text!templates/settings/settingsEmail.html'
], function($, _, Backbone, toastr, HubService, session, Hub, EmailConfiguration, SettingsTab, strings, template) {

	var ProfileView = SettingsTab.extend({

		tabName: 'email',

		template: _.template(template),

		serverType: 'serverNone',

		events: {
			'change input[type=radio]': 'onClickServerType',
			'click #testButton': 'onClickTest',
			'click #saveButton': 'onClickSave'
		},

		initialize: function(options) {
			console.debug(options.hub);
			this.hub = options.hub;
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings,
				hub: this.hub.toJSON(),
				hasServer: this.hub.hasServer(),
				hasGmailServer: this.hub.hasGmailServer(),
				hasOtherServer: this.hub.hasOtherServer()
			}));

			var email = this.hub.get('email');
			if (email && email.server) {
				switch (email.server) {
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

		createEmailConfiguration: function() {
            return new EmailConfiguration({
                server: this.$el.find('#server').val(),
                secure: this.$el.find('#secure').prop('checked'),
                username: this.$el.find('#username').val(),
                password: this.$el.find('#password').val(),
                senderAddress: this.$el.find('#senderAddress').val()
            });
		},

		setServerType: function(type) {
			this.serverType = type;
			this.enableForm(type !== 'serverNone');
			var isGmail = (type === 'serverGmail');
			this.$el.find('#server').val(isGmail ? 'smtp.gmail.com' : '');
			this.$el.find('#secure').prop('checked', isGmail);
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

            var config = this.createEmailConfiguration();

            console.debug(this.serverType);

            if (this.serverType && this.serverType !== 'serverNone') {
                var error = config.validate();

                if (!error) {
                    var hub = new Hub({ 
                		id: this.hub.id, 
            			email: config.toJSON(),
            			url: session.getSelectedHubUrl()
            		});

                    console.debug('saving model: ', hub.toJSON());

                    hub.save(null, {
                        context: this,
                        error: function(model, response, options) {
                            if (response.status == 202) {
                            	toastr.success('E-mail configuration saved.');
                            } else {
                                toastr.error('E-mail configuration was not saved. See the log file for details.');
                            }
                        }
                    });
                } else {
                    toastr.error(error);
                    this.footerView.showLoading(false);
                }
            } else {
            	console.debug('nothing to save');
            }
		}		

	});

	return ProfileView;
});