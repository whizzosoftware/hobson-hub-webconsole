// Filename: views/tasks/taskConditionsEditor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/taskConditionClass',
	'views/tasks/taskConditions',
	'views/tasks/taskControlSelectors',
	'i18n!nls/strings',
	'text!templates/tasks/taskConditionsEditor.html'
], function($, _, Backbone, toastr, ItemList, TaskConditionClass, TaskConditionsView, TaskControlSelectorsView, strings, taskIfTemplate) {

	return Backbone.View.extend({

		template: _.template(taskIfTemplate),

		events: {
			'click #buttonPlus': 'onClickPlus',
			'onClickAdd': 'onClickAdd'
		},

		initialize: function(options) {
			this.devices = options.devices;
			this.task = options.task;
			this.subviews = [];
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
			this.$el.append(this.template({
				strings: strings,
				task: this.task.toJSON()
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

				new ItemList({model: TaskConditionClass, url: '/api/v1/users/local/hubs/local/tasks/conditionClasses?expand=item', sort: 'name'}).fetch({
					context: this,
					success: function(model, response, options) {
						// render task condition class selectors
						var v = new TaskControlSelectorsView({
							model: model
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
			var msg = this.validate(a);
			if (!msg) {
				var c = {
					cclass: {"@id": a.id},
					values: a.properties
				}
				if (!this.task.hasTriggerCondition()) {
					this.task.setTriggerCondition(c);
				} else {
					this.task.addCondition(c);
				}
				this.renderConditions();
				this.closePlusPanel();
			} else {
				toastr.error(msg);
			}
		},

		validate: function(a) {
			for (var i=0; i < a.supportedProperties.length; i++) {
				var sp = a.supportedProperties[i];
				var varName = sp['@id'];
				if (!_.has(a.properties, varName)) {
					return sp.name + ' is a required field.';
				} else {
					var value = a.properties[varName];
					switch (sp.type) {
						case 'STRING':
							return _.isString(value) ? null : sp.name + ' must be a string.';
						case 'NUMBER':
							return (value === '' || isNaN(value)) ? sp.name + ' must be a number.' : null;
						default:
							break;
					}
				}
			}
			return null;
		}

	});

});