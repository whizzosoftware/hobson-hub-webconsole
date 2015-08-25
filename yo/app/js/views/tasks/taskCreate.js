// Filename: views/tasks/taskCreate.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/task',
	'models/device',
	'views/tasks/taskConditionsEditor',
	'views/tasks/taskActionsEditor',
	'i18n!nls/strings',
	'text!templates/tasks/taskCreate.html'
], function($, _, Backbone, toastr, ItemList, Task, Device, TaskConditionsEditorView, TaskActionsEditorView, strings, taskAddTemplate) {

	var TaskCreateView = Backbone.View.extend({

		template: _.template(taskAddTemplate),

		events: {
			'click #buttonCreate': 'onClickCreate'
		},

		initialize: function() {
			this.task = {
				conditions: [],
				actionSet: {
					actions: []
				}
			};
			this.subviews = [];
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({
				strings: strings,
				task: this.task
			}));

			var devices = new ItemList({
				model: Device,
				url: '/api/v1/users/local/hubs/local/devices?expand=item'
			});

			devices.fetch({
				context: this,
				success: function(model, response, options) {
					// render the "if" section
					var v = new TaskConditionsEditorView({
						devices: model,
						task: options.context.task
					});
					options.context.$el.find('#taskConditionsEditor').html(v.render().el);
					options.context.subviews.push(v);

					// render the "then" section
					var v = new TaskActionsEditorView({
						devices: model,
						task: options.context.task
					});
					options.context.$el.find('#taskActionsPanel').html(v.render().el);
					options.context.subviews.push(v);
				},
				error: function(model, response, options) {
					console.debug('nope!');
				}
			});

			return this;
		},

		onClickCreate: function(e, model) {
			this.hideErrors();

			var t = new Task({url: '/api/v1/users/local/hubs/local/tasks'});

			// set the task name
			var name = this.$el.find('#taskName').val();
			if (name && name.length > 0) {
				t.set('name', name);
			}

			// set the task description
			var desc = this.$el.find('#taskDescription').val();
			if (desc && desc.length > 0) {
				t.set('description', desc);
			}

			// set the task trigger condition
			if (this.task.triggerCondition) {
				t.addCondition({
					cclass: { '@id': this.task.triggerCondition.id },
					values: this.task.triggerCondition.properties
				});
			}

			// set any additional conditions
			for (var i=0; i < this.task.conditions.length; i++) {
				t.addCondition({
					cclass: { '@id': this.task.conditions[i].id },
					values: this.task.conditions[i].properties
				});
			}

			// set actions
			for (var i=0; i < this.task.actionSet.actions.length; i++) {
				t.addAction({
					cclass: { '@id': this.task.actionSet.actions[i].id },
					values: this.task.actionSet.actions[i].properties
				});
			}

			console.debug('creating task: ', this.task, t);

			// send the create task request
			t.save(null, {
				context: this,
				error: function(model, response, options) {
					console.debug(model, response, options);
					if (response.status === 202) {
						toastr.success(strings.TaskCreated);
						Backbone.history.navigate('tasks', {trigger: true});
					} else {
						options.context.showErrors(options.context, response.responseJSON.errors);
					}
				}
			});
		},

		hideErrors: function() {
			this.$el.find('#error').css('display', 'none');
			this.$el.find('#errorMsg').html('');
		},

		showErrors: function(ctx, errors) {
			var msg = '<ul>';
			for (var i=0; i < errors.length; i++) {
				msg += '<li>' + errors[i].message + '</li>';
			}
			msg += '</ul>';
			ctx.$el.find('#error').css('display', 'block');
			ctx.$el.find('#errorMsg').html(msg);
		}

	});

	return TaskCreateView;
});