// Filename: views/sidebar
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'moment',
	'models/session',
	'services/hub',
	'models/itemList',
	'models/variable',
	'models/activityLogEntry',
	'views/sidebar/activityLog',
	'i18n!nls/strings',
	'text!templates/sidebar/sidebar.html',
	'text!templates/sidebar/sunriseSunset.html'
], function($, _, Backbone, toastr, moment, session, HubService, ItemList, ActivityLogEntry, Variable, ActivitiesView, strings, template, sunriseTemplate) {
	return Backbone.View.extend({

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

      HubService.getGlobalVariables(this, function(model, response, options) {
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
				}, function(model, response, options) {
					toastr.error(strings.GlobalVariableError);
				}
			);

			HubService.getActivityLog(
				this,
				function(model, response, options) {
					var el = new ActivitiesView({model: model}).render().el;
					options.context.$el.find('.activity-container').html(el);
				},
				function(model, response, options) {
					toastr.error(strings.ActivityLogError);
				}
			);

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

});
