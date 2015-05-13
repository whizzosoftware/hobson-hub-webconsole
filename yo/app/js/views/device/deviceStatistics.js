// Filename: views/device/deviceStatistics.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/deviceConfig',
	'views/device/deviceTab',
	'i18n!nls/strings',
	'text!templates/device/deviceStatistics.html'
], function($, _, Backbone, toastr, DeviceConfig, DeviceTab, strings, template) {

	return DeviceTab.extend({

		tabName: 'statistics',

		template: _.template(template),

		events: {
			'click #telemetry': 'onClickTelemetry'
		},

		initialize: function(options) {
			this.device = options.device;
			this.telemetry = options.telemetry;
		},

		renderTabContent: function(el) {
			console.debug('stats rendering tab content');

			el.html(this.template({
				strings: strings,
				device: this.device.toJSON(),
				telemetry: this.telemetry.toJSON()
			}));

			if (this.telemetry.hasData()) {

				var data = this.telemetry.get('data');

				var chartData = {
				  // A labels array that can contain any sort of values
				  labels: [],
				  series: []
				};

				var keys = Object.keys(data);

				// build a list of labels
				var firstName = keys[0];
				for (var t in data[firstName]) {
					chartData.labels.push(parseFloat(t));
				}

				// add empty arrays to the series key
				for (var i=0; i < keys.length; i++) {
					chartData.series.push([]);
				}

				// build a list of series
				for (var i=0; i < chartData.labels.length; i++) {
					var t = chartData.labels[i];
					for (var x=0; x < keys.length; x++) {
						var k = keys[x];
						var v = data[k][t];
						chartData.series[x][i] = parseFloat(v);
					}
				}

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
					series: [
					],
					title: {
						text: null
					}
	            };

				var offset = new Date().getTimezoneOffset() * 60000;

	            for (var varName in data) {
	              var d = {
	                name: strings[varName],
	                data: []
	              };
	              var varResults = data[varName];
	              for (var t in varResults) {
	                // apply timezone offset to the data
	                d.data.push([parseFloat(t) * 1000 - offset, parseFloat(varResults[t])]);
	              }
	              if (d.data.length > 0) {
	                chartConfig.series.push(d);
	              }
	            }

				this.$el.find('#chart').highcharts(chartConfig);
			}

			this.setChartNotice();

			return this;
		},

		setChartNotice: function() {
			if (this.telemetry.hasData()) {
				this.$el.find('#chartNotice').html('');
			} else {
				this.$el.find('#chartNotice').html(this.telemetry.get('enabled') ? strings.NoStatisticsCollected : strings.NoStatisticsEnabled);
			}
		},

		onClickTelemetry: function(e) {
			var el = $(e.target);
			var newValue = el.prop('checked');
			var config = new DeviceConfig({
				id: 'id',
				enabled: newValue
			}, this.telemetry.get('links').self);
			el.prop('disabled', true);
			config.save(null, {
				context: this,
				error: function(model, response, options) {
					el.prop('disabled', false);
					if (response.status === 202) {
						options.context.telemetry.set('enabled', newValue);
						options.context.setChartNotice();
					} else {
						toastr.error(strings.DeviceConfigUpdateFailure);
						el.prop('checked', !newValue);
					}
				}
			});
		}

	});

});