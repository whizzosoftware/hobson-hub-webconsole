// Filename: views/data/dataTab.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/user',
	'views/collection/dataStreams',
	'i18n!nls/strings',
	'text!templates/data/dataTab.html'
], function($, _, Backbone, toastr, UserService, DataStreamsView, strings, dataTemplate) {
	return Backbone.View.extend({

		template: _.template(dataTemplate),

		events: {
			'viewDataStream': 'onViewDataStream'
		},

		initialize: function(options) {
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings
			}));

			UserService.getDataStreams(this, function(ctx, model) {
				if (this.dsView) {
					this.dsView.remove();
				}
				ctx.dsView = new DataStreamsView({model: model});
				ctx.$el.find('.tasks').html(
					ctx.dsView.render().el
				);
			}, function() {
				console.debug('Error!');
			});


			return this;
		},

		onViewDataStream: function(event, ds) {
			var id = ds.get('@id');
			console.debug('view data stream', id);
			Backbone.history.navigate('#data/' + encodeURIComponent(id) + '/view', {trigger: true});
		}
	});
});