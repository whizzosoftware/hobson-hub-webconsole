// Filename: views/tasks/taskActionsEditor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/task',
	'models/itemList',
	'models/taskActionClass',
	'services/propertyContainerValidator',
	'views/tasks/taskActions',
	'views/tasks/taskControlSelectors',
	'i18n!nls/strings',
	'text!templates/tasks/taskActionsEditor.html'
], function($, _, Backbone, toastr, TaskService, ItemList, TaskActionClass, PropertyContainerValidator, TaskActionsView, TaskControlSelectorsView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'click #buttonPlus': 'onClickPlus',
			'onClickAdd': 'onClickAdd',
			'deleteAction': 'onDeleteAction'
		},

		initialize: function(options) {
			this.devices = options.devices;
			this.task = options.task;
			this.subviews = [];
		},

		remove: function() {
			this.removeSubviews();
			this.taskActionsView.remove();
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
				strings: strings
			}));

			TaskService.getActionClasses(this, function(model, response, options) {
				options.context.actionClasses = model;
				options.context.renderActions(options.context);
			}, function(model, response, options) {
				toastr.error(strings.ErrorOccurred);
			});

			return this;
		},

		renderActions: function(ctx) {
			if (ctx.taskActionsView) {
				ctx.taskActionsView.remove();
			}

			ctx.taskActionsView = new TaskActionsView({
				task: ctx.task,
				actionClasses: ctx.actionClasses,
				devices: ctx.devices
			});

			ctx.$el.find('#taskActions').html(ctx.taskActionsView.render().el);
		},

		closePlusPanel: function() {
			this.$el.find('#buttonPlus').removeClass('active');
			this.$el.find('#taskActionSelectors').css('display', 'none');
			this.removeSubviews();
		},

		onClickPlus: function(e) {
			e.preventDefault();

			var el = this.$el.find('#taskActionSelectors');

			if (el.css('display') === 'none') {
				el.css('display', 'block');
				$(e.target).addClass('active');
				var v = new TaskControlSelectorsView({
					model: this.actionClasses
				});
				el.html(v.render().el);
				this.subviews.push(v);
			} else {
				this.closePlusPanel();
			}
		},

		onClickAdd: function(e, a) {
			// replace property container class ID with actual object
			a.cclass = TaskService.findPropertyContainerClass(this.actionClasses, a.cclass['@id']);
			if (a.cclass) {
				a.cclass = a.cclass.toJSON();
			}

			var msg = PropertyContainerValidator.validate(a);
			if (!msg) {
				this.task.addAction(a);
				this.renderActions(this);
				this.closePlusPanel();
			} else {
				toastr.error(msg);
			}
		},

		onDeleteAction: function(event, action) {
			var actions = this.task.get('actionSet').actions;
			var row = -1;
			for (var i in actions) {
				if (actions[i].id == action.id) {
					row = i;
					break;
				}
			}
			if (row > -1) {
				actions.splice(row, 1);
			}
			this.render();
		}

	});

});