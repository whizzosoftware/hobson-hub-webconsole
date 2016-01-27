// Filename: views/data/dataLegend.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/data/dataLegend.html'
], function($, _, Backbone, strings, dataTemplate) {
	return Backbone.View.extend({

		template: _.template(dataTemplate),

		events: {
			'click li': 'onClick'
		},

		render: function() {
			// determine where to get the series names from
			var chartSeries = this.model.data.series;
			if (chartSeries instanceof Chartist.Pie) {
				chartSeries = this.model.data.labels;
			}

			// build an array of series names
			var legendNames = [];
			chartSeries.forEach(function(legend, i) {
				legendNames.push(legend.name || legend);
			});

			// render legend
			this.$el.html(this.template({
				model: legendNames
			}));

			return this;
		},

		onClick: function(event) {
			var t = $(event.target);
			if (t.hasClass('inactive')) {
				t.removeClass('inactive');
				this.$el.trigger('addSeries', t.attr('id'));
			} else {
				t.addClass('inactive');
				this.$el.trigger('removeSeries', t.attr('id'));
			}
		}
	});
});