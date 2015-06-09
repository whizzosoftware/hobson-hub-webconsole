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
			for (var i=0; i < this.model.length; i++) {
				var task = this.model.at(i);
				var v = new TaskView({model: task});
				this.$el.append(v.render().el);
				this.subviews.push(v);
			}
			return this;
		}

	});

});