// Filename: views/devices/addDevice.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'services/device',
	'models/itemList',
	'models/device',
	'models/actionClass',
	'models/hubConfig',
	'views/property/propertySetEditPanel',
	'i18n!nls/strings',
	'text!templates/devices/addDevice.html'
], function($, _, Backbone, toastr, HubService, DeviceService, ItemList, Device, ActionClass, HubConfig, PropertySetEditPanelView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'change #addDeviceList': 'onDeviceChange',
			'click #buttonAdd': 'onButtonAdd'
		},

		initialize: function(options) {
			this.subviews = [];
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({
				strings: strings
			}));

			HubService.getActionClasses(this, function(model, response, options) {
				var select = options.context.$el.find('#addDeviceList');
				console.log(select);
				var options = {};
				for (var i=0; i < model.length; i++) {
					var a = model.at(i);
					options[a.get('name')] = a.get('@id');
				}
				select.empty();
				select.append($("<option></option>").attr("value", "none").text("Select an option..."));
				$.each(options, function(key, value) {
					select.append($("<option></option>").attr("value", value).text(key));
				});
				console.log(options);
			}, function(model, xhr, options) {
				toastr.error(strings.ErrorOccurred);
				console.log('An error occurred retrieving the action class list', model, xhr);
			}, 'addDevice');

			return this;
		},

		onDeviceChange: function(event) {
			var url = $(event.currentTarget).val();
			if (url && url !== 'none') {
				HubService.getActionClass(this, url, function(model, response, options) {
					if (options.context.propertySetEditPanel) {
						options.context.propertySetEditPanel.remove();
					}
					var v = new PropertySetEditPanelView({model: model});
					options.context.currentPropertySet = model;
					options.context.propertySetEditPanel = v;
					options.context.$el.find('#propertySetEditPanel').append(v.render().el);
				}, function(model, xhr, options) {
					options.context.$el.find('#addDeviceList').val('none');
					toastr.error(strings.ErrorOccurred);
					console.log('An error occurred retrieving the action class', url, model, xhr);
				});
			}
		},

		onButtonAdd: function(event) {
			var properties = this.propertySetEditPanel.getValues();
			var url = this.currentPropertySet.get('@id');
			if (properties) {
				HubService.invokeActionClass(this, url, {
					cclass: {'@id': url},
					values: properties
				}, function(model, response, options) {
					console.log('success!'); 
				}, function(model, xhr, options) {
					if (xhr.status === 202) {
						toastr.success('Cool!');
						Backbone.history.navigate('dashboard', {trigger: true});
					} else {
						toastr.error(strings.ErrorOccurred);
						console.log('An error occurred invoking the action class', url, model, xhr); 
					}
				});
			}
		},

		hideErrors: function() {
			this.$el.find('#error').css('display', 'none');
			this.$el.find('#errorMsg').html('');
		},

		showErrors: function(ctx, errors) {
			var msg = '<ul>';
			for (var i=0; i < errors.length; i++) {
				msg += '<li>' + errors[i].message + '</li>';
			}
			msg += '</ul>';
			ctx.$el.find('#error').css('display', 'block');
			ctx.$el.find('#errorMsg').html(msg);
		}

	});

});	