// Filename: views/tasks/taskControlSelector.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/tasks/taskControlEditPanel',
	'i18n!nls/strings',
	'text!templates/tasks/taskControlSelector.html',
], function($, _, Backbone, TaskControlEditPanelView, strings, template) {

	var TaskControlSelectorView = Backbone.View.extend({

		tagName: 'li',

		className: "accordion-navigation",

		template: _.template(template),

		events: {
			'click .accordion-item': 'onClick'
		},

		initialize: function(options) {
			this.showSun = options.showSun;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				control: this.model.toJSON()
			}));
			return this;
		},

		onClick: function(e) {
			e.preventDefault();
			var content = this.$el.find('.content');
			if (content.css('display') === 'none') {
				// load and show the edit panel
				this.editPanel = new TaskControlEditPanelView({
					model: this.model,
					showSun: this.showSun
				});
				content.html(this.editPanel.render().el);
				content.css('display', 'block');
			} else {
				// hide and remove the edit panel
				content.css('display', 'none');
				this.editPanel.remove();
			}
		}

	});

	return TaskControlSelectorView;
});