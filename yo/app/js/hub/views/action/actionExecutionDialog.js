// Filename: views/action/actionExecution.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/error',
	'services/action',
	'views/action/actionExecutionPanel',
	'i18n!nls/strings',
	'text!templates/action/actionExecutionDialog.html'
], function($, _, Backbone, toastr, ErrorService, ActionService, ActionExecutionPanelView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'click #buttonExecute': 'onButtonExecute',
			'click #buttonCancel': 'onButtonCancel',
			'jobComplete': 'onJobComplete'
		},

		initialize: function(options) {
			this.subviews = [];

			if (options && options.title) {
				this.title = options.title;
			} else {
				this.title = this.model.get('name');
			}

			$(document).on('closed.fndtn.reveal', '[data-reveal]', $.proxy(function(e) {
				this.onRevealClosed();
			}, this));			
		},

		remove: function() {
			$(document).off('closed.fndtn.reveal');
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({
				title: this.title,
				submitButtonName: this.submitButtonName ? this.submitButtonName : 'Execute',
				strings: strings
			}));

			ActionService.getActionClass(this.model.get('@id'), function(model, response, options) {
				if (this.actionExecutionPanel) {
					this.actionExecutionPanel.remove();
				}
				this.actionExecutionPanel = new ActionExecutionPanelView({model: model, noPropertiesPrompt: 'Are you sure you want to execute this action?'});
				this.$el.find('#actionExecutionPanel').html(this.actionExecutionPanel.render().el);
			}.bind(this), function(response, xhr, options) {
				toastr.error(ErrorService.createErrorHtml(xhr, strings));
				console.debug('An error occurred retrieving the action class', url, model, xhr);
			}.bind(this));

			return this;
		},

		onButtonExecute: function(event) {
			var btn = $(event.currentTarget);
			if (!btn.hasClass('disabled')) {
				if (btn.text() === strings.Close) {
					this.$el.foundation('reveal', 'close');
				} else {
					var properties = null;
					if (this.actionExecutionPanel) {
						properties = this.actionExecutionPanel.getValues();
					}
					ActionService.executeAction(this.model.get('@id'), properties, function(model, response, options) {
						var loc = response.getResponseHeader('Location');
						if (loc) {
							ActionService.getJobStatus(loc, function(model, response, options) {
								this.$el.find('#buttonExecute').addClass('disabled');
								if (model && model.status === 'Complete') {
									toastr.success('Action successfully executed');
									this.$el.foundation('reveal', 'close');
								} else {
									this.$el.find('#promptPanel').html("");
									this.$el.find('#buttonExecute').text(strings.Close);
									this.actionExecutionPanel.showJobStatus(loc);
								}
							}.bind(this), function(model, response, errors) {
								console.log('error job status', model);
							}.bind(this));
						}
					}.bind(this), function(response, xhr, options) {
						this.$el.foundation('reveal', 'close');
						toastr.error(ErrorService.createErrorHtml(xhr, strings));
					}.bind(this));
				}
			}
		},

		onButtonCancel: function(event) {
			event.preventDefault();
			if (!$(event.currentTarget).hasClass('disabled')) {
				this.$el.foundation('reveal', 'close');
			}
		},

		onJobComplete: function() {
			this.$el.find('#buttonExecute').removeClass('disabled');
			this.$el.find('#buttonCancel').addClass('disabled');
		},

		onRevealClosed: function() {
			this.actionExecutionPanel.stop();
		}

	});

});	