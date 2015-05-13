// Filename: views/tasks/taskAction.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/tasks/taskAction.html'
], function($, _, Backbone, strings, template) {

	var TaskConditionView = Backbone.View.extend({
		template: _.template(template),

		tagName: 'li',

		className: 'action',

		initialize: function(options) {
			this.action = options.action;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				action: this.action,
				description: this.createDescription(this.action)
			}));
			return this;
		},

		createDescription: function(action) {
			switch (action.actionClassId) {
				case 'log':
					return 'Log "' + action.properties.message.value + '"';
				case 'email':
					return 'Send e-mail to ' + action.properties.recipientAddress.value + ' with subject "' + action.properties.subject.value + '"';
				default:
					return action.name;
			}
		}		

	});

	return TaskConditionView;
});