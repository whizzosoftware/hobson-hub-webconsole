// Filename: views/taskActionSelectors
define([
	'jquery',
	'underscore',
	'backbone',
	'views/tasks/taskControlSelector',
	'i18n!nls/strings'
], function($, _, Backbone, TaskControlSelectorView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: "accordion",

		attributes: {
			'data-accordion': ''
		},

		subviews: [],

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.empty();

			for (var i=0; i < this.model.length; i++) {
				var v = new TaskControlSelectorView({model: this.model.at(i)});
				this.$el.append(v.render().el);
				this.subviews.push(v);
			}

			return this;
		},

	});

});