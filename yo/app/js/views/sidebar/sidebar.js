// Filename: views/sidebar
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'models/itemList',
	'models/variable',
	'models/activityLogEntry',
	'views/sidebar/activityLog',
	'i18n!nls/strings',
	'text!templates/sidebar/sidebar.html',
	'text!templates/sidebar/sunriseSunset.html'
], function($, _, Backbone, moment, ItemList, ActivityLogEntry, Variable, ActivitiesView, strings, template, sunriseTemplate) {
	var SidebarView = Backbone.View.extend({

		template: _.template(template),

		sunriseTemplate: _.template(sunriseTemplate),

		render: function() {
			this.$el.html(
				this.template({
					strings: strings
				})
			);

			if (this.activities) {
				this.activities.remove();
			}

			var itemList = new ItemList({model: Variable, url: '/api/v1/users/local/hubs/local/globalVariables?expand=item'});
			itemList.fetch({
				context: this,
				success: function(model, response, options) {
					var sunrise = model.findWhere({name: 'sunrise'});
					var sunset = model.findWhere({name: 'sunset'});
					if (sunrise && sunrise.get('value') && sunset && sunset.get('value')) {
						options.context.$el.find('.sidebar-subheader').html(
							options.context.sunriseTemplate({
								sunrise: options.context.convertTimeString(sunrise.get('value')),
								sunset: options.context.convertTimeString(sunset.get('value'))
							})
						);
					} else {
						options.context.$el.find('.sidebar-subheader').html(strings.NoLatLong);
					}
				}, error: function(model, response, options) {
					console.debug("error getting global variables", response);
				}
			});

			this.activities = new ItemList({model: ActivityLogEntry, url: '/api/v1/users/local/hubs/local/activityLog'});
			this.activities.fetch({
				context: this,
				success: function(model, response, options) {
					var el = new ActivitiesView({model: model}).render().el;
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