// Filename: views/insight/insight.js
define([
	'jquery',
	'underscore',
	'backbone',
	'highcharts',
	'i18n!nls/strings',
	'text!templates/insight/electric.html'
], function($, _, Backbone, Highcharts, strings, energyTemplate) {

	var ElectricalView = Backbone.View.extend({

		template: _.template(energyTemplate),

		render: function() {
			// create dashboard shell
			this.$el.append(this.template({strings: strings}));

			// create base load line chart
			this.$el.find('#graphBaseline1').highcharts({
				chart: {
		            type: 'spline'
		        },
		        title: {
		            text: '2014 Avg. Consumption (Regional)'
		        },
		        xAxis: {
		        	categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		        },
		        yAxis: {
		            title: {
		                text: 'Millions of BTUs (MMBTU)'
		            }
		        },
		        series: [{
		            name: 'Consumption',
		            data: [12.70, 10.29, 8.71, 5.10, 3.67, 3.51, 5.73, 4.36, 3.83, 4.80, 11.92, 12.08],
		        }, {
		            name: 'Base load',
		            type: 'area',
		            data: [3.51, 3.51, 3.51, 3.51, 3.51, 3.51, 3.51, 3.51, 3.51, 3.51, 3.51, 3.51]
		        }]
			});

			return this;
		},

	});

	return ElectricalView;
});