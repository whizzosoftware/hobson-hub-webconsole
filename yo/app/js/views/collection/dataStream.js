// Filename: views/collection/dataStream.js
define([
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'i18n!nls/strings',
	'text!templates/collection/dataStream.html'
], function($, _, Backbone, moment, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		template: _.template(template),

		events: {
			'click #view-ds': 'onClickView',
			'click #delete-ds': 'onClickDelete'
		},

		render: function() {
			console.debug('render data stream: ', this.model);

			this.$el.append(
				this.template({
					strings: strings,
					dataStream: this.model.toJSON()
				})
			);

			return this;
		},

		onClickView: function() {
			console.debug('onClickView');
			this.$el.trigger('viewDataStream', this.model);
		},

		onClickDelete: function() {
			this.$el.trigger('deleteDataStream', this.model);
		}

	});

});