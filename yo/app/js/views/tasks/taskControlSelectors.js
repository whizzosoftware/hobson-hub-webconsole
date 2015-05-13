// Filename: views/taskActionSelectors
define([
	'jquery',
	'underscore',
	'backbone',
	'views/tasks/taskControlSelector',
	'i18n!nls/strings'
], function($, _, Backbone, TaskControlSelectorView, strings) {

	var TaskControlSelectorsView = Backbone.View.extend({

		tagName: 'ul',

		className: "accordion",

		attributes: {
			'data-accordion': ''
		},

		subviews: [],

		initialize: function(options) {
			this.classes = options.classes;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.empty();

			for (var i=0; i < this.classes.length; i++) {
				var v = new TaskControlSelectorView({control: this.classes.at(i)});
				this.$el.append(v.render().el);
				this.subviews.push(v);
			}

			return this;
		},

	});

	return TaskControlSelectorsView;
});