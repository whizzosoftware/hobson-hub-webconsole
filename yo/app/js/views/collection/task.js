// Filename: views/collection/task.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'i18n!nls/strings',
	'text!templates/collection/task.html'
], function($, _, Backbone, moment, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		template: _.template(template),

		events: {
			'click #deleteButton': 'onClickDelete'
		},

		render: function() {
			this.$el.append(
				this.template({
					strings: strings,
					task: this.model.toJSON(),
					moment: moment
				})
			);

			return this;
		},

		onClickDelete: function() {
			this.model.destroy({
				context: this,
				error: function(model, response, options) {
					if (response.status === 202) {
						options.context.$el.trigger('taskDeleteSuccess');
					} else {
						options.context.$el.trigger('taskDeleteFail');
					}
				}
			});
		}

	});

});