// Filename: views/tasks/taskCondition.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'services/taskDescription',
	'models/recurrenceDefaults',
	'i18n!nls/strings',
	'text!templates/tasks/taskCondition.html'
], function($, _, Backbone, moment, TaskDescription, RecurrenceDefaults, strings, taskConditionTemplate) {

	return Backbone.View.extend({
		template: _.template(taskConditionTemplate),

		tagName: 'li',

		className: 'condition',

		events: {
			'click #delete-condition': 'onDeleteCondition'
		},

		initialize: function(options) {
			this.devices = options.devices;
			this.condition = options.condition;
			this.recurrenceDefaults = new RecurrenceDefaults();
			this.description = TaskDescription.createDescription(this.condition);
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				condition: this.condition,
				description: this.description
			}));
			return this;
		},

		onDeleteCondition: function(condition) {
			this.$el.trigger('deleteCondition', this.condition);
		}

	});

});