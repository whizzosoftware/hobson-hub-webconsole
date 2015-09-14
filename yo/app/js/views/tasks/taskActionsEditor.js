// Filename: views/tasks/taskActionsEditor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/itemList',
	'models/taskActionClass',
	'services/propertyContainerValidator',
	'views/tasks/taskActions',
	'views/tasks/taskControlSelectors',
	'i18n!nls/strings',
	'text!templates/tasks/taskActionsEditor.html'
], function($, _, Backbone, toastr, ItemList, TaskActionClass, PropertyContainerValidator, TaskActionsView, TaskControlSelectorsView, strings, template) {

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

			this.renderActions();

			return this;
		},

		renderActions: function() {
			if (this.taskActionsView) {
				this.taskActionsView.remove();
			}

			this.taskActionsView = new TaskActionsView({
				task: this.task 
			});

			this.$el.find('#taskActions').html(this.taskActionsView.render().el);
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
				new ItemList({model: TaskActionClass, url: '/api/v1/users/local/hubs/local/tasks/actionClasses?expand=item&constraints=true', sort: 'name'}).fetch({
					context: this,
					success: function(model, response, options) {
						$(e.target).addClass('active');
						var v = new TaskControlSelectorsView({
							model: model
						});
						el.html(v.render().el);
						options.context.subviews.push(v);
					},
					error: function() {
						toastr.error('Unable to retrieve action list.');
					}
				});
			} else {
				this.closePlusPanel();
			}
		},

		onClickAdd: function(e, a) {
			var msg = PropertyContainerValidator.validate(a);
			if (!msg) {
				this.task.actionSet.actions.push(a);
				this.renderActions();
				this.closePlusPanel();
			} else {
				toastr.error(msg);
			}
		},

		onDeleteAction: function(event, action) {
			var actions = this.task.actionSet.actions;
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