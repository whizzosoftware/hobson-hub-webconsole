// Filename: views/sidebar
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'models/itemList',
	'models/variable',
	'models/activityLog',
	'views/sidebar/activityLog',
	'i18n!nls/strings',
	'text!templates/sidebar/sidebar.html'
], function($, _, Backbone, moment, ItemList, Variable, ActivityCollection, ActivitiesView, strings, sidebarTemplate) {
	var SidebarView = Backbone.View.extend({
		template: _.template(sidebarTemplate),

		render: function() {
			this.$el.html(
				this.template({
					strings: strings
				})
			);

			if (this.activities) {
				this.activities.remove();
			}

			var itemList = new ItemList({url: '/api/v1/users/local/hubs/local/globalVariables', model: Variable});
			itemList.fetch({
				context: this,
				success: function(model, response, options) {
					var s = model.findWhere({name: 'sunrise'});
					if (s && s.get('value')) {
						console.debug(s);
						options.context.$el.find('#sunrise').html(options.context.convertTimeString(s.get('value')));
					}
					s = model.findWhere({name: 'sunset'});
					if (s && s.get('value')) {
						options.context.$el.find('#sunset').html(options.context.convertTimeString(s.get('value')));
					}
				}
			});

			this.activities = new ActivityCollection('/api/v1/users/local/hubs/local/activityLog');
			this.activities.fetch({
				context: this,
				success: function(model, response, options) {
					console.debug('got activities: ', model);
					var el = new ActivitiesView(model).render().el;
					console.debug('final activity render: ', el);
					options.context.$el.find('.activity-container').html(el);
				},
				error: function() {
					console.log('nope!');
				}
			});

			return this;
		},

		convertTimeString: function(s) {
			if (s) {
				var now = new Date();
				var month = now.getMonth() + 1;
				var date = now.getDate();
				var str = now.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date) + ' ' + s;
				return moment(str).toDate().toLocaleTimeString().replace(/:\d{2}\s/,' ');
			} else {
				return null;
			}
		}
	});

	return SidebarView;
});