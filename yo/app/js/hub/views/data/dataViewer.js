// Filename: views/data/dataViewer.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'chartist',
	'chartistTooltip',
	'moment',
	'services/hub',
	'views/data/dataLegend',
	'i18n!nls/strings',
	'text!templates/data/dataViewer.html'
], function($, _, Backbone, toastr, Chartist, ChartistTooltip, moment, HubService, DataLegendView, strings, dataTemplate) {
	return Backbone.View.extend({

		template: _.template(dataTemplate),

		series: null,

		lastDate: null,

		events: {
			'change #inr-selection': 'onInrSelection',
			'addSeries': 'onAddSeries',
			'removeSeries': 'onRemoveSeries'
		},

		initialize: function(options) {
			this.dataStreamId = options.dataStreamId;
			this.inr = options.inr ? options.inr : 'HOURS_4';
		},

		remove: function() {
			if (this.legendView) {
				this.legendView.remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({
				name: 'Test',
				strings: strings
			}));

			HubService.getDataStream(this, this.dataStreamId, function(ctx, model) {
				ctx.$el.find('#ds-name').text(model.get('name'));
				ctx.dataStreamDataId = model.get('links').data;
				ctx.$el.find('#details-loading').css('display', 'none');
				ctx.$el.find('#details').css('display', 'block');
				ctx.loadData(ctx.dataStreamDataId);
			}, function(ctx, model) {
				toastr.error(strings.ErrorOccurred);
			});

			return this;
		},

		loadData: function(url) {
			if (!url) {
				url = this.dataStreamDataId;
			}

			// show loading prompt
			var n = this.$el.find('.ct-chart');
			this.showLoadingPrompt();

			// remove old legend view if it exists
			if (this.legendView) {
				this.legendView.remove();
			}

			HubService.getDataStreamData(this, url, this.inr, function(ctx, model) {
				this.series = [];

				var seriesMap = {};
				var data = model.get('data');
				var inr = model.get('interval');
				var endTime = moment(model.get('endTime'));

				ctx.$el.find('#inr-selection').val(inr);

				if (data.length > 0) {
					// build series data model
					for (var p in data) {
						var ts = data[p]['timestamp'];
						for (var k in data[p]) {
							if (k !== 'timestamp') {
								var s = seriesMap[k];
								if (!s) {
									var name = ctx.extractVariableName(k);
									s = {name: model.get("fields")[name], data: []};
									this.series.push(s);
									seriesMap[k] = s;
								}
								s.data.push({x: new Date(ts), y: data[p][k]});
							}
						}
					}

					// construct chart
					var chart = new Chartist.Line(n.get(0), {
						// labels: labels,
						series: this.series
					}, {
						showPoint: true,
						seriesBarDistance: 15,
						fullWidth: true,
						axisX: {
							type: Chartist.FixedScaleAxis,
							divisor: 10,
							labelInterpolationFnc: ctx.labelFunc
						},
						axisY: {
							onlyInteger: true
						},
						plugins: [
							Chartist.plugins.tooltip({
								'class': 'ct-tooltip',
								tooltipFnc: ctx.tooltipFnc
							})
						]
					}, [
						['screen and (min-width: 641px) and (max-width: 1024px)', {
							seriesBarDistance: 10,
							axisX: {
								divisor: 6
							}
						}],
						['screen and (max-width: 640px)', {
							seriesBarDistance: 5,
							axisX: {
								divisor: 4
							}
						}]
					]);

					// remove the loading prompt once the chart is rendered
					chart.on('created', function(data) {
						ctx.removeLoadingPrompt();

						// create new legend view
						ctx.legendView = new DataLegendView({model: chart});
						ctx.$el.find('#legend-container').html(
							ctx.legendView.render().el
						);
					});

				} else {
					ctx.showLoadingPrompt(strings.NoDataAvailable);
				}

			}, function() {
				toastr.error(strings.ErrorOccurred);
			});
		},

		labelFunc: function(value) {
			var d = moment(value).format('MMM D');
			var t = moment(value).format('h:mma');
			if (!this.lastDate || this.lastDate !== d) {
				this.lastDate = d;
				return t + '<br/>' + d;
			} else {
				return t;
			}
		},

		tooltipFnc: function(e, d) {
			var str = d.split(',');
			var m = moment(parseInt(str[0]));
			return (Math.round(parseFloat(str[1]) * 10) / 10) + ' on ' + m.format('MMM Do, YYYY h:mma');
		},

		showLoadingPrompt: function(str) {
			this.removeLoadingPrompt();
			var n = this.$el.find('.ct-chart');
			if (str) {
				n.html('<div id="loading" style="margin-top: 50px; text-align: center;">' + str + '</div>');
			} else {
				n.html('<div id="loading" style="margin-top: 50px; text-align: center;"><img src="img/loading.gif" /></div>')
			}
		},

		removeLoadingPrompt: function() {
			var old = this.$el.find('#loading');
			if (old) {
				old.remove();
			}
		},

		extractVariableName: function(s) {
			if (s) {
				var n = s.lastIndexOf(':');
				if (n > -1) {
					return s.substring(n+1, s.length);
				}
			}
			return s;
		},

		onInrSelection: function(e) {
			this.inr = $(e.target).val();
			this.loadData();
			var url = Backbone.history.getFragment().split('?')[0];
			Backbone.history.navigate(url + '?inr=' + this.inr, {trigger: false});
		},

		onAddSeries: function(event, ix) {
			// TODO
		},

		onRemoveSeries: function(event, ix) {
			// TODO
		}
	});
});
