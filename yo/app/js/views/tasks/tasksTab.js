// Filename: views/tasks/tasksTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'foundation.core',
	'i18n!nls/strings',
	'text!templates/tasks/tasksTab.html'
], function($, _, Backbone, Foundation, strings, tasksTemplate) {

	var TasksTabView = Backbone.View.extend({

		template: _.template(tasksTemplate),

		initialize: function(options) {
			this.userId = options.userId;
			this.hubId = options.hubId;
		},

		render: function() {
			this.$el.append(this.template({strings: strings}));

			return this;
		}

	});

	return TasksTabView;
});