// Filename: views/tasks/taskAction.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/task',
	'services/taskDescription',
	'i18n!nls/strings',
	'text!templates/tasks/taskAction.html'
], function($, _, Backbone, TaskService, TaskDescription, strings, template) {
	return Backbone.View.extend({
		template: _.template(template),

		tagName: 'li',

		className: 'action',

		events: {
			'click #delete-action': 'onDeleteAction'
		},

		initialize: function(options) {
			this.action = options.action;
			this.actionClasses = options.actionClasses;
			this.devices = options.devices;
		},

		render: function() {
			var actionClass = TaskService.findPropertyContainerClass(this.actionClasses, this.action.cclass['@id']);

			this.$el.html(this.template({
				strings: strings,
				action: this.action,
				description: TaskDescription.createDescription(actionClass.toJSON(), this.action, this.devices.toJSON())
			}));
			return this;
		},

		onDeleteAction: function(action) {
			this.$el.trigger('deleteAction', this.action);
		}
	});
});