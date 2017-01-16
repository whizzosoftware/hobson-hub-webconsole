// Filename: views/action/executionStatus.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/action',
	'i18n!nls/strings',
	'text!templates/action/executionStatus.html'
], function($, _, Backbone, toastr, ActionService, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		initialize: function(options) {
			this.url = options.url;
		},

		remove: function() {
			this.cancelRefresh();
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({
				strings: strings
			}));

			this.refreshInterval = setInterval(function() {
				this.refresh();
			}.bind(this), 1000);

			return this;
		},

		refresh: function() {
			ActionService.getJobStatus(this.url, function(model) {
				// add status messages
				var el = this.$el.find('#statusArea');
				el.empty();
				for (var i=0; i < model.messages.length; i++) {
					el.append('<li>' + model.messages[i] + '</li>');
				}
				var el2 = this.$el.find('#statusContainer');
				el2.scrollTop(el2[0].scrollHeight);

				// handle completion or failure
				if (model.status == 'Complete') {
					this.cancelRefresh();
					this.$el.find('#statusPrompt').html('<i class="fa fa-check"></i>&nbsp;Finished');
					this.$el.trigger('jobComplete');
				} else if (model.status == 'Failed') {
					this.cancelRefresh();
					this.$el.find('#statusPrompt').html('<i class="fa fa-warning"></i>&nbsp;Failed');
					this.$el.trigger('jobFailed');
				}
			}.bind(this), function(a, b) {
				console.debug('error', a, b);
			}.bind(this));
		},

		cancelRefresh: function() {
			if (this.refreshInterval) {
				clearInterval(this.refreshInterval);
				this.refreshInterval = null;
			}
		},

		stop: function() {
			ActionService.stopJob(this.url, function() {
				this.$el.find('#statusPrompt').html('<i class="fa fa-check"></i>&nbsp;Successfully stopped');
				this.$el.trigger('jobComplete');
			}.bind(this), function() {
				this.$el.find('#statusPrompt').html('<i class="fa fa-remove"></i>&nbsp;Failed to stop');
				this.$el.trigger('jobComplete');
			}.bind(this));
		}

	});

});	