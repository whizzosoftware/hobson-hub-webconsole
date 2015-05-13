// Filename: views/tasks/taskCreate.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/task',
	'models/devices',
	'views/tasks/taskConditionsEditor',
	'views/tasks/taskActionsEditor',
	'i18n!nls/strings',
	'text!templates/tasks/taskCreate.html'
], function($, _, Backbone, Task, Devices, TaskConditionsEditorView, TaskActionsEditorView, strings, taskAddTemplate) {

	var deviceListViews = {};

	var TaskAddView = Backbone.View.extend({

		template: _.template(taskAddTemplate),

		subviews: [],

		events: {
			'click #buttonCreate': 'onClickCreate'
		},

		initialize: function() {
			this.task = new Task({url: '/api/v1/users/local/hubs/local/tasks'});
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({strings: strings}));

			var devices = new Devices({
				url: '/api/v1/users/local/hubs/local/devices'
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
			console.debug('create', this.task.toJSON());
			this.task.save(null, {
				error: function(model, response, options) {
					if (response.status === 202) {
						console.debug('woot!');
					} else {
						console.debug('nope!')
					}
				}
			});
		}

	});

	return TaskAddView;
});