// Filename: views/login/app.js
define([
	'jquery',
	'underscore',
	'backbone',
	'cookies',
	'authFailHandler',
	'models/session',
	'models/user',
	'i18n!nls/strings',
	'text!templates/login/app.html',
	'text!templates/login/login.html'
], function($, _, Backbone, Cookies, authFailHandler, session, User, strings, template, loginTemplate) {
	var AppView = Backbone.View.extend({

		name: 'login',

		template: _.template(template),

		loginTemplate: _.template(loginTemplate),

		events: {
			"click #login-button": "onClickLogin"
		},

		render: function() {
			console.debug('login view render');

			this.$el.html(this.template());

			// request options from login resource to determine if there is a default user
			$.ajax('/api/v1/login?expand=user', {
				context: this,
				type: 'OPTIONS',
				dataType: 'json',
				timeout: 5000,
				success: function(data, status, response) {
					this.$el.find('#panelContent').html(
						this.loginTemplate({
							strings: strings,
							defaultUser: data.defaultUser,
							notice: Backbone.history.getFragment().indexOf('expired=true') > -1 ? strings.SessionExpired : null,
							serverFail: false
						})
					);
				},
				error: function(response, status, error) {
					this.$el.find('#panelContent').html(
						this.loginTemplate({
							strings: strings,
							serverFail: true
						})
					);
				}
			});

			return this;
		},

		onClickLogin: function(event) {
			event.preventDefault();

			// clear visual errors
			$('#userLabel').removeClass('error');
			$('#passwordLabel').removeClass('error');
			$('#passwordError').css('display', 'none');

			// get the username/password from the form
			var username = $('#user').val();
			var password = $('#password').val();

			// set up the HTTP Authorization header with the new credentials
			//
			// Note that we temporarily set handling of 418 response codes to a local function so we can
			// display an error message to the user. This will be set back to the generalized auth failure
			// handler function once the login call is successfully made.
			$.ajaxSetup({
				statusCode: {
					401: this.loginFail
				}
			});

			// fetch the user's information
			$.ajax('/api/v1/login?expand=user', {
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({username: username, password: password}),
				dataType: 'json',
				success: function(data, status, response) {
					// restore 401 responses to route to the login page
					$.ajaxSetup({
						statusCode: {
							401: authFailHandler
						}
					});

					// set a cookie for token
					// note that it's a secure cookie if the user is not local
					console.debug('cookie token secure=' + !data.local);
					Cookies.set('Token', data.token, { secure: false });

					// set the user information in the session
					session.setUser(new User(data.user));

					// auto-navigate to the page for the user
					Backbone.history.navigate('#' + username, {trigger: true});
				},
				error: function(response, status, error) {
					console.debug('login error!');
				}
			});
		},

		loginFail: function() {
			$('#userLabel').addClass('error');
			$('#passwordLabel').addClass('error');
			$('#passwordError').css('display', 'block');
		}		

	});

	return AppView;
});