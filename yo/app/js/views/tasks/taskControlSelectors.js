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

		initialize: function() {
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
			this.$el.empty();

			this.$el.append('<h6 style="text-align: left;">' + strings.TaskConditionActionPrompt + '</h6>');

			if (this.model.length > 0) {
				for (var i=0; i < this.model.length; i++) {
					var v = new TaskControlSelectorView({model: this.model.at(i)});
					this.$el.append(v.render().el);
					this.subviews.push(v);
				}
			} else {
				this.$el.append('<p style="margin-top: 20px;">' + strings.NoAdditionalItemsAppropriate + '</p>');
			}

			return this;
		},

	});

});