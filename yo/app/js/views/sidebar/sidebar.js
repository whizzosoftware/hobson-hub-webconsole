// Filename: views/sidebar
define([
	'jquery',
	'underscore',
	'backbone',
	'models/activityLog',
	'views/sidebar/activityLog',
	'i18n!nls/strings',
	'text!templates/sidebar/sidebar.html'
], function($, _, Backbone, ActivityCollection, ActivitiesView, strings, sidebarTemplate) {
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
		}
	});

	return SidebarView;
});