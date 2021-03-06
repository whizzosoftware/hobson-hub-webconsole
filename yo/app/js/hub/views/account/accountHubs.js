// Filename: views/account/accountHubs.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/session',
	'models/itemList',
	'models/hub',
	'views/account/accountTab',
	'views/account/hubs',
	'i18n!nls/strings',
	'text!templates/account/accountHubs.html'
], function($, _, Backbone, session, ItemList, Hub, AccountTab, HubsView, strings, template) {

	return AccountTab.extend({

		tabName: 'Hubs',

		template: _.template(template),

		events: {
			'click #button-add': 'onClickAdd'
		},

    	initialize: function() {
    		this.subviews = [];
    	},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		renderTabContent: function(el) {
			el.html(this.template({
				strings: strings
			}));

			// retrieve list of user hubs
			var hubs = new ItemList(null, {model: Hub, url: session.getHubsUrl() + '?expand=item'});
			hubs.fetch({
				context: this,
				success: function(model, response, options) {
					var ctx = options.context;
					if (model && model.length > 0) {
						var v = new HubsView({model: model});
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

});
