// Filename: views/tasks/taskConditionsEditor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/taskConditionClass',
	'services/propertyContainerValidator',
	'views/tasks/taskConditions',
	'views/tasks/taskControlSelectors',
	'i18n!nls/strings',
	'text!templates/tasks/taskConditionsEditor.html'
], function($, _, Backbone, toastr, ItemList, TaskConditionClass, PropertyContainerValidator, TaskConditionsView, TaskControlSelectorsView, strings, taskIfTemplate) {

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
			this.showSun = options.showSun;
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

			this.renderConditions();

			return this;
		},

		renderConditions: function() {
			if (this.taskConditionsView) {
				this.taskConditionsView.remove();
			}

			this.taskConditionsView = new TaskConditionsView({
				devices: this.devices, 
				task: this.task 
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

				new ItemList({model: TaskConditionClass, url: '/api/v1/users/local/hubs/local/tasks/conditionClasses?expand=item&constraints=true', sort: 'name'}).fetch({
					context: this,
					success: function(model, response, options) {
						// render task condition class selectors
						var v = new TaskControlSelectorsView({
							model: options.context.task.triggerCondition ? new ItemList(model.where({type: 'evaluator'})) : new ItemList(model.where({type: 'trigger'})),
							showSun: options.context.showSun
						});
						options.context.$el.find('#taskConditionSelectors').html(v.render().el);
						options.context.subviews.push(v);
					},
					error: function() {
						toastr.error('Error retrieving condition classes');
					}
				});
			} else {
				this.closePlusPanel();
			}
		},

		onClickAdd: function(e, a) {
			var msg = PropertyContainerValidator.validate(a);
			if (!msg) {
				if (a.type == 'trigger') {
					this.task.triggerCondition = a;
				} else {
					this.task.conditions.push(a);
				}
				this.renderConditions();
				this.closePlusPanel();
			} else {
				toastr.error(msg);
			}
		},

		onDeleteCondition: function(event, condition) {
			if (this.task.triggerCondition.id == condition.id) {
				this.task.triggerCondition = null;
				this.task.conditions = [];
			} else {
				var conditions = this.task.conditions;
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