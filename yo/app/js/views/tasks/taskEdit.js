// Filename: views/tasks/taskEdit.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'services/device',
	'services/task',
	'models/itemList',
	'models/task',
	'models/device',
	'models/hubConfig',
	'views/tasks/taskProperties',
	'views/tasks/taskConditionsEditor',
	'views/tasks/taskActionsEditor',
	'i18n!nls/strings',
	'text!templates/tasks/taskEdit.html'
], function($, _, Backbone, toastr, HubService, DeviceService, TaskService, ItemList, Task, Device, HubConfig, TaskPropertiesView, TaskConditionsEditorView, TaskActionsEditorView, strings, taskAddTemplate) {

	var TaskCreateView = Backbone.View.extend({

		template: _.template(taskAddTemplate),

		events: {
			'click #buttonCreate': 'onClickCreate'
		},

		initialize: function(options) {
			this.id = options.id;
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
				editMode: this.id
			}));

			if (this.id) {
				TaskService.getTask(this, this.id, function(model, response, options) {
					options.context.task = model;
					options.context.renderEditorViews(options.context);
				}, function(model, response, options) {
					toastr.error(strings.ErrorOccurred);
				});
			} else {
				this.task = TaskService.createNewTask();
				this.renderEditorViews(this);
			}

			return this;
		},

		renderEditorViews: function(ctx) {
			// render the properties view (name, description, etc.)
			var v = new TaskPropertiesView({task: ctx.task});
			ctx.subviews.push(v);
			ctx.$el.find('#taskProperties').html(v.render().el);

			// get hub configuration to determine if lat/long has been set
			HubService.getHubConfiguration(ctx, function(model, response, options) {
				var showSun = model.hasLatLong();
				// get list of devices for the device picker
				DeviceService.getDevices(options.context, function(model, response, options) {
					// render the "if" section
					var v = new TaskConditionsEditorView({
						devices: model,
						task: options.context.task,
						showSun: showSun
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
				}, function(model, response, options) {
					toastr.error(strings.ErrorOccurred);
				});
			}, function(model, response, options) {
				toastr.error(strings.ErrorOccurred);
			});
		},

		onClickCreate: function(e, model) {
			this.hideErrors();

			var t = this.task;

			var errors = [];
			if (!t.hasConditions()) {
				errors.push({message: strings.NeedOneCondition});
			}
			if (!t.hasActions()) {
				errors.push({message: strings.NeedOneAction});
			}

			if (errors.length > 0) {
				this.showErrors(this, errors);
			} else {
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

				// send the create task request
				t.save(null, {
					context: this,
					error: function(model, response, options) {
						if (response.status === 202) {
							toastr.success(strings.TaskCreated);
							Backbone.history.navigate('tasks', {trigger: true});
						} else {
							options.context.showErrors(options.context, response.responseJSON.errors);
						}
					}
				});
			}
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