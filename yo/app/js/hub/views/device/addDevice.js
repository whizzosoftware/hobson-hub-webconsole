// Filename: views/device/addDevice.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'services/action',
	'services/device',
	'services/error',
	'models/itemList',
	'models/device',
	'models/actionClass',
	'models/hubConfig',
	'views/action/actionExecutionPanel',
	'views/job/jobStatus',
	'i18n!nls/strings',
	'text!templates/device/addDevice.html'
], function($, _, Backbone, toastr, HubService, ActionService, DeviceService, ErrorService, ItemList, Device, ActionClass, HubConfig, ActionExecutionPanelView, JobStatusView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'change #addDeviceList': 'onDeviceChange',
			'click #buttonAdd': 'onButtonAdd',
			'jobExecutionComplete': 'onJobExecutionComplete'
		},

		initialize: function(options) {
		},

		remove: function() {
			if (this.actionExecutionPanel) {
				this.actionExecutionPanel.remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({
				strings: strings
			}));

			HubService.getHubActionClasses(function(model, response, options) {
			  if (model.length > 0) {
          var select = this.$el.find('#addDeviceList');
          select.empty();
          var options = {};
          for (var i = 0; i < model.length; i++) {
            var a = model.at(i);
            options[a.get('name')] = a.get('@id');
          }
          select.append($("<option></option>").attr("value", "none").text("Select an option..."));
          $.each(options, function (key, value) {
            select.append($("<option></option>").attr("value", value).text(key));
          });
        } else {
          this.$el.find('#prompt').html('<p>' + strings.NoAddableDevices + '</p>');
          this.$el.find('#buttonAdd').remove();
        }
			}.bind(this), function(model, xhr, options) {
				toastr.error(strings.ErrorOccurred);
				console.log('An error occurred retrieving the action class list', model, xhr);
			}.bind(this), 'addDevice');

			return this;
		},

		onDeviceChange: function(event) {
			var url = $(event.currentTarget).val();
			if (url && url !== 'none') {
				ActionService.getActionClass(url, function(model, response, options) {
					if (this.actionExecutionPanel) {
						this.actionExecutionPanel.remove();
					}
					this.actionExecutionPanel = new ActionExecutionPanelView({model: model});
					this.$el.find('#actionExecutionPanel').html(this.actionExecutionPanel.render().el);
				}.bind(this), function(response, xhr, options) {
					this.$el.find('#addDeviceList').val('none');
					toastr.error(ErrorService.createErrorHtml(xhr, strings));
					console.debug('An error occurred retrieving the action class', url, model, xhr);
				}.bind(this));
			}
		},

		onButtonAdd: function(event) {
			var properties = this.actionExecutionPanel.getValues();
			var url = this.actionExecutionPanel.model.get('@id');
			if (properties) {
				ActionService.executeAction(url, properties, function(model, response, options) {
					var loc = response.getResponseHeader('Location');
					if (loc) {
						ActionService.getJobStatus(loc, function(model, response, options) {
							this.$el.find('#buttonAdd').addClass('disabled');
							if (model && model.status === 'Complete') {
								toastr.success('New device successfully added.');
								Backbone.history.navigate('devices', {trigger: true});
							} else {
								this.$el.find('#promptPanel').html("");
								this.$el.find('#buttonAdd').text(strings.Close);
								this.actionExecutionPanel.showJobStatus(loc);
								this.$el.find('.form-control-bar').html('');
							}
						}.bind(this), function(model, response, errors) {
							console.log('error job status', model);
						}.bind(this));
					}
				}.bind(this), function(model, response) {
					toastr.error(ErrorService.createErrorHtml(response, strings));
					console.debug('An error occurred invoking the action class', url, response);
				}.bind(this));
			}
		},

		onJobExecutionComplete: function() {
			Backbone.history.navigate('devices', {trigger: true});
		}

	});

});
