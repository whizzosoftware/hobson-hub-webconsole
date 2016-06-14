// Filename: views/data/dataStreamVariable.js
define([
	'jquery',
	'underscore',
	'backbone',
	'services/task',
	'services/taskDescription',
	'i18n!nls/strings',
	'text!templates/data/dataStreamVariable.html'
], function($, _, Backbone, TaskService, TaskDescription, strings, template) {
	return Backbone.View.extend({
		template: _.template(template),

		tagName: 'li',

		className: 'action',

		events: {
			'click #delete-action': 'onDeleteAction'
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				model: this.model
			}));
			return this;
		},

		onDeleteAction: function(action) {
			this.$el.trigger('deleteVariable', this.model.variable);
		}
	});
});