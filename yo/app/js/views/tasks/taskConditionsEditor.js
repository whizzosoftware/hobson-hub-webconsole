// Filename: views/tasks/taskConditionsEditor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/taskConditionClasses',
	'models/taskConditionClass',
	'views/tasks/taskConditions',
	'views/tasks/taskControlSelectors',
	'i18n!nls/strings',
	'text!templates/tasks/taskConditionsEditor.html'
], function($, _, Backbone, TaskConditionClasses, TaskConditionClass, TaskConditionsView, TaskControlSelectorsView, strings, taskIfTemplate) {

	var TaskConditionsEditorView = Backbone.View.extend({

		template: _.template(taskIfTemplate),

		events: {
			'click #buttonPlus': 'onClickPlus',
			'onClickAdd': 'onClickAdd'
		},

		subviews: [],

		initialize: function(options) {
			this.devices = options.devices;
			this.task = options.task;
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

				var classes = new TaskConditionClasses('/api/v1/users/local/hubs/local/tasks/conditionClasses');
				classes.fetch({
					context: this,
					success: function(model, response, options) {
						console.debug('got condition list: ', model);
						// render task condition class selectors
						var v = new TaskControlSelectorsView({
							classes: model
						});
						options.context.$el.find('#taskConditionSelectors').html(v.render().el);
						options.context.subviews.push(v);
					},
					error: function() {
						console.debug('nope!');
					}
				});
			} else {
				this.closePlusPanel();
			}
		},

		onClickAdd: function(e, a) {
			this.task.addCondition({
				pluginId: a.pluginId,
				conditionClassId: a.id,
				properties: a.properties
			});
			this.renderConditions();
			this.closePlusPanel();
		}

	});

	return TaskConditionsEditorView;
});