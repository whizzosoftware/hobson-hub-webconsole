// Filename: views/tasks/taskConditionsEditor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/task',
	'models/itemList',
	'models/taskConditionClass',
	'services/propertyContainerValidator',
	'views/tasks/taskConditions',
	'views/tasks/taskControlSelectors',
	'i18n!nls/strings',
	'text!templates/tasks/taskConditionsEditor.html'
], function($, _, Backbone, toastr, TaskService, ItemList, TaskConditionClass, PropertyContainerValidator, TaskConditionsView, TaskControlSelectorsView, strings, taskIfTemplate) {

	return Backbone.View.extend({

		template: _.template(taskIfTemplate),

		events: {
			'click #buttonPlus': 'onClickPlus',
			'onClickAdd': 'onClickAdd',
			'deleteCondition': 'onDeleteCondition'
		},

		initialize: function(options) {
			this.devices = options.devices;
			this.task = options.task;
			this.subviews = [];
			this.timeMode = options.timeMode;
		},

		remove: function() {
			this.removeSubviews();
			this.taskConditionsView.remove();
			Backbone.View.prototype.remove.call(this);
		},

		removeSubviews: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				task: this.task
			}));

			TaskService.getConditionClasses(function(model, response, options) {
				this.conditionClasses = model;
				this.renderConditions();
			}.bind(this), function(model, response, options) {
				toastr.error(strings.ErrorOccurred);
			}.bind(this));

			return this;
		},

		renderConditions: function() {
			if (this.taskConditionsView) {
				this.taskConditionsView.remove();
			}

			this.taskConditionsView = new TaskConditionsView({
				devices: this.devices, 
				task: this.task,
				conditionClasses: this.conditionClasses
			});

			this.$el.find('#taskConditions').html(this.taskConditionsView.render().el);
		},

		closePlusPanel: function() {
			this.$el.find('#buttonPlus').removeClass('active');
			this.$el.find('#taskConditionSelectors').css('display', 'none');
			this.removeSubviews();
		},

		onClickPlus: function(e) {
			e.preventDefault();

			var el = this.$el.find('#taskConditionSelectors');

			if (el.css('display') === 'none') {
				$(e.target).addClass('active');
				el.css('display', 'block');

				// render task condition class selectors
				var v = new TaskControlSelectorsView({
					model: this.task.hasTriggerCondition(this.conditionClasses) ? this.conditionClasses.filteredList('type', 'evaluator') : this.conditionClasses.filteredList('type', 'trigger'),
					timeMode: this.timeMode
				});
				this.$el.find('#taskConditionSelectors').html(v.render().el);
				this.subviews.push(v);
			} else {
				this.closePlusPanel();
			}
		},

		onClickAdd: function(e, a) {
			// replace property container class ID with actual object
			a.cclass = TaskService.findPropertyContainerClass(this.conditionClasses, a.cclass['@id']);
			if (a.cclass) {
				a.cclass = a.cclass.toJSON();
			}

			var msg = PropertyContainerValidator.validate(a);
			if (!msg) {
				this.task.addCondition(a);
				this.renderConditions();
				this.closePlusPanel();
			} else {
				toastr.error(msg);
			}
		},

		onDeleteCondition: function(event, condition) {
			if (this.task.getTriggerConditionIndex(this.conditionClasses) === this.task.getConditionIndex(condition)) {
				this.task.set('conditions', []);
			} else {
				var conditions = this.task.get('conditions');
				var row = -1;
				for (var i in conditions) {
					if (condition[i] && condition[i].id == condition.id) {
						row = i;
						break;
					}
				}
				if (row > -1) {
					conditions.splice(row, 1);
				}
			}
			this.render();
		}

	});

});