// Filename: views/account/accountHubs.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'models/hubs',
	'models/hub',
	'views/account/accountTab',
	'views/account/hubs',
	'i18n!nls/strings',
	'text!templates/account/accountHubs.html'
], function($, _, Backbone, session, Hubs, Hub, AccountTab, HubsView, strings, template) {

	var AccountHubsView = AccountTab.extend({

		tabName: 'Hubs',

		template: _.template(template),

		subviews: [],

		events: {
			'click #button-add': 'onClickAdd'
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			console.debug('renderTabContent');

			el.html(this.template({
				strings: strings
			}));

			// retrieve list of user hubs
			var hubs = new Hubs(session.getHubsUrl());
			hubs.fetch({
				context: this,
				success: function(model, response, options) {
					var ctx = options.context;
					console.debug('got hubs: ', model);
					if (model && model.length > 0) {
						var v = new HubsView({hubs: model});
						ctx.$el.find('#hubListContainer').html(v.render().el);
						ctx.subviews.push(v);
					} else {
						ctx.$el.find('#hubListContainer').html('<p class="notice">' + strings.NoHubs + '</p>');
					}
				},
				error: function(model, response, options) {
					options.context.$el.find('#hubListContainer').html('<p class="notice">An error occurred</p>');
				}
			});			
		},

		onClickAdd: function(e) {
			e.preventDefault();
			console.debug('click');
			var hub = new Hub({name: this.$el.find('#hubName').val(), url: session.getHubsUrl()});
			hub.save(null, {
				success: function() {
					console.log('success!');
				},
				error: function() {
					console.log('nope!');
				}
			});
		}

	});

	return AccountHubsView;
});