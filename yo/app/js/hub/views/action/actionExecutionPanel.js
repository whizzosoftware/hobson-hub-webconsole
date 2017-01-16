// Filename: views/action/actionExecutionPanel.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/action',
	'views/property/propertySetEditPanel',
	'views/action/executionStatus',
	'i18n!nls/strings',
	'text!templates/action/actionExecutionPanel.html'
], function($, _, Backbone, toastr, ActionService, PropertySetEditPanelView, ExecutionStatusView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'click #buttonStop': 'onStopClick',
			'click #buttonDone': 'onDoneClick',
			'jobComplete': 'onJobComplete',
			'jobFailed': 'onJobFailed'
		},

		initialize: function(options) {
			this.noPropertiesPrompt = options ? options.noPropertiesPrompt : null;
			this.propertySetEditView = new PropertySetEditPanelView({model: this.model});
		},

		remove: function() {
			if (this.propertySetEditView != null) {
				this.propertySetEditView.remove();
			}
			this.propertySetEditView = null;
			if (this.executionStatusView != null) {
				this.executionStatusView.remove();
			}
			this.executionStatusView = null;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({
				strings: strings
			}));

			if (this.model.has('supportedProperties')) {
				this.$el.find('#actionExecutionContainer').html(this.propertySetEditView.render().el);
			} else if (this.noPropertiesPrompt) {
				this.$el.find('#actionExecutionContainer').html('<p class="text-center">' + this.noPropertiesPrompt + '</p>');
			} else {
				this.$el.find('#actionExecutionContainer').html('');
			}

			return this;
		},

		showJobStatus: function(jobUrl) {
			if (this.executionStatusView) {
				this.executionStatusView.remove();
			}
			this.executionStatusView = new ExecutionStatusView({url: jobUrl});
			this.$el.find('#actionExecutionContainer').html(this.executionStatusView.render().el);
			this.$el.find('.job-control-bar').css('display', 'block');
			this.$el.find('#buttonDone').addClass('disabled');
		},

		getValues: function() {
			return this.propertySetEditView ? this.propertySetEditView.getValues() : null;
		},

		onStopClick: function(e) {
			e.preventDefault();
			if (!$(e.currentTarget).hasClass('disabled')) {
				if (this.executionStatusView) {
					this.executionStatusView.stop();
				}
				this.$el.find('#buttonStop').addClass('disabled');
				this.$el.find('#buttonDone').removeClass('disabled');
			}
		},

		onDoneClick: function(e) {
			e.preventDefault();
			if (!$(e.currentTarget).hasClass('disabled')) {
				this.$el.trigger('jobExecutionComplete');
			}
		},

		onJobComplete: function() {
			this.$el.find('#buttonStop').addClass('disabled');
			this.$el.find('#buttonDone').removeClass('disabled');
		},

		onJobFailed: function() {
			this.$el.find('#buttonStop').addClass('disabled');
			this.$el.find('#buttonDone').removeClass('disabled');
		}

	});

});	