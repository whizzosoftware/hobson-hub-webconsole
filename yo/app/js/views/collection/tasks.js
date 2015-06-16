// Filename: views/collection/tasks.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'views/collection/task',
	'i18n!nls/strings'
], function($, _, Backbone, toastr, TaskView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: 'small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		events: {
			'taskDeleteSuccess': 'onTaskDeleteSuccess',
			'taskDeleteFail': 'onTaskDeleteFail'
		},

		initialize: function() {
			this.subviews = [];
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
				this.subviews[ix] = null;
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			if (this.model.length > 0) {
				for (var i=0; i < this.model.length; i++) {
					var task = this.model.at(i);
					var v = new TaskView({model: task});
					this.$el.append(v.render().el);
					this.subviews.push(v);
				}
			} else {
				this.$el.html(
					'<p class="notice">' + strings.NoTasksCreated + '</p>'
				);
			}
			return this;
		},

		onTaskDeleteSuccess: function() {
			toastr.success(strings.TaskDeleteSuccess);
			this.$el.html('');
			this.render();
		},

		onTaskDeleteFail: function() {
			toastr.error(strings.TaskDeleteFailure);
		}

	});

});