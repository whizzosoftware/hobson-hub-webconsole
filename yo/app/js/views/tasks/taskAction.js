// Filename: views/tasks/taskAction.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/taskDescription',
	'i18n!nls/strings',
	'text!templates/tasks/taskAction.html'
], function($, _, Backbone, TaskDescription, strings, template) {
	return Backbone.View.extend({
		template: _.template(template),

		tagName: 'li',

		className: 'action',

		events: {
			'click #delete-action': 'onDeleteAction'
		},

		initialize: function(options) {
			this.action = options.action;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				action: this.action,
				description: TaskDescription.createDescription(this.action)
			}));
			return this;
		},

		onDeleteAction: function(action) {
			this.$el.trigger('deleteAction', this.action);
		}
	});
});