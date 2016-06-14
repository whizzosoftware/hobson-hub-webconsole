// Filename: views/tasks/taskProperties.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/tasks/taskProperties.html'
], function($, _, Backbone, strings, template) {

	return Backbone.View.extend({
		template: _.template(template),

		initialize: function(options) {
			this.task = options.task;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				task: this.task.toJSON()
			}));
			return this;
		}

	});

});