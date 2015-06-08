// Filename: views/device/deviceStatistics.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'highcharts',
	'models/deviceTelemetry',
	'views/device/deviceTab',
	'i18n!nls/strings',
	'text!templates/device/deviceStatistics.html'
], function($, _, Backbone, toastr, HighCharts, DeviceTelemetry, DeviceTab, strings, template) {

	return DeviceTab.extend({

		tabName: 'statistics',

		template: _.template(template),

		events: {
			'click #telemetry': 'onClickTelemetry'
		},

		initialize: function(options) {
			this.datasets = options.datasets;
		},

		renderTabContent: function(el) {
			var hasData = this.hasValidDataset();

			el.html(this.template({
				strings: strings,
				device: this.model.toJSON(),
				hasData: hasData
			}));

			if (this.hasValidDataset()) {
				var offset = new Date().getTimezoneOffset() * 60000;

				// create timeseries chart data
				var series = [];
				for (var ix=0; ix < this.datasets.length; ix++) {
					var dataset = this.datasets.at(ix);
					var datasetItems = dataset.get('data').itemListElement;
					// create a new series for this dataset -- a series has a name and an array of data
					// since this is a time series, each data element is itself an array of length 2 -- time and value
					var s = {
						name: strings[dataset.get('name')],
						data: []
					};
					for (var ix2=0; ix2 < datasetItems.length; ix2++) {
						s.data.push([parseFloat(datasetItems[ix2].item.time) * 1000 - offset, parseFloat(datasetItems[ix2].item.value)]);
					}
					series.push(s);
				}

				// create chart config
	            var chartConfig = {
		            chart: {
		              type: 'spline',
		              backgroundColor: '#F1F1F1',
		              height: 300,
		              style: {
		              	fontFamily: '"Open Sans", Helvetica, sans-serif'
		              }
		            },
					xAxis: {
						type: 'datetime',
						labels: {
							style: {
								color: '#26313d'
							}
						},
						lineColor: '#BFBFBF',
						tickColor: '#BFBFBF'
					},
					yAxis: {
						labels: {
							style: {
								color: '#26313d'
							}
						}
					},
					series: series,
		        	title: {
						text: null
					}
	            };

				this.$el.find('#chart').highcharts(chartConfig);
			}

			this.setChartNotice(this);

			return this;
		},

		setChartNotice: function(context) {
			if (context.hasValidDataset()) {
				context.$el.find('#chartNotice').html('');
			} else {
				context.$el.find('#chartNotice').html(context.model.get('telemetry').enabled ? strings.NoStatisticsCollected : strings.NoStatisticsEnabled);
			}
		},

		hasValidDataset: function() {
			for (var ix=0; ix < this.datasets.length; ix++) {
				if (this.datasets.at(ix).hasData()) {
					return true;
				}
			}
			return false;
		},

		onClickTelemetry: function(e) {
			var el = $(e.target);
			var newValue = el.prop('checked');
			el.prop('disabled', true);
			var telem = new DeviceTelemetry({
				id: 'id',
				url: this.model.get('telemetry')['@id'],
				enabled: newValue
			});
			telem.save(null, {
				context: this,
				error: function(model, response, options) {
					el.prop('disabled', false);
					if (response.status === 202) {
						options.context.model.get('telemetry').enabled = newValue;
						options.context.setChartNotice(options.context);
					} else {
						toastr.error(strings.DeviceConfigUpdateFailure);
						el.prop('checked', !newValue);
					}
				}
			});
		}

	});

});