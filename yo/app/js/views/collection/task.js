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

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					task: this.model.toJSON()
				})
			);

			return this;
		}

	});

});