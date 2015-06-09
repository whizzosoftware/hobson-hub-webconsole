// Filename: views/tasks/taskActionsEditor.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/itemList',
	'models/taskActionClass',
	'views/tasks/taskActions',
	'views/tasks/taskControlSelectors',
	'i18n!nls/strings',
	'text!templates/tasks/taskActionsEditor.html'
], function($, _, Backbone, ItemList, TaskActionClass, TaskActionsView, TaskControlSelectorsView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

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
			this.$el.append(this.template({
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
				new ItemList({model: TaskActionClass, url: '/api/v1/users/local/hubs/local/tasks/actionClasses', sort: 'name'}).fetch({
					context: this,
					success: function(model, response, options) {
						console.log('got action list: ', model);
						$(e.target).addClass('active');
						var v = new TaskControlSelectorsView({
							model: model
						});
						el.html(v.render().el);
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
			this.task.addAction({
				cclass: {'@id': a.id},
				values: a.properties
			});
			this.renderActions();
			this.closePlusPanel();
		}

	});

});