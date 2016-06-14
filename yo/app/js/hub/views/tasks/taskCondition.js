// Filename: views/tasks/taskCondition.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'services/task',
	'services/taskDescription',
	'models/recurrenceDefaults',
	'i18n!nls/strings',
	'text!templates/tasks/taskCondition.html'
], function($, _, Backbone, moment, TaskService, TaskDescription, RecurrenceDefaults, strings, taskConditionTemplate) {

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
			this.conditionClasses = options.conditionClasses;
			this.recurrenceDefaults = new RecurrenceDefaults();
		},

		render: function() {
			var conditionClass = TaskService.findPropertyContainerClass(this.conditionClasses, this.condition.cclass['@id']);

			this.$el.html(this.template({
				strings: strings,
				condition: this.condition,
				description: TaskDescription.createDescription(conditionClass.toJSON(), this.condition, this.devices.toJSON())
			}));
			return this;
		},

		onDeleteCondition: function(condition) {
			this.$el.trigger('deleteCondition', this.condition);
		}

	});

});