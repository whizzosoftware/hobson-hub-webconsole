// Filename: views/collection/task.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/collection/task.html'
], function($, _, Backbone, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		template: _.template(template),

		initialize: function(options) {
			this.task = options.task;
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					task: this.task.toJSON()
				})
			);

			return this;
		}

	});

});