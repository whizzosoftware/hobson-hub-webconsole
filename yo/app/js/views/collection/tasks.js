// Filename: views/collection/tasks.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/collection/task',
	'i18n!nls/strings'
], function($, _, Backbone, TaskView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: 'small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		subviews: [],

		initialize: function(options) {
			this.tasks = options.tasks;
		},

		render: function() {
			console.debug('rendering tasks: ', this.tasks);
			for (var i=0; i < this.tasks.length; i++) {
				var task = this.tasks.at(i);
				console.debug('task: ', task);
				var v = new TaskView({task: task});
				this.$el.append(v.render().el);
				this.subviews.push(v);
			}
			return this;
		}

	});

});