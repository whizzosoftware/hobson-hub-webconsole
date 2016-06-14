// Filename: views/powerOffConfirm.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'i18n!nls/strings',
	'text!templates/powerOffConfirm.html'
], function($, _, Backbone, toastr, HubService, strings, pluginSettingsTemplate) {

	return Backbone.View.extend({

		template: _.template(pluginSettingsTemplate),

		events: {
			'click #saveButton': 'onClickSave',
			'click #cancelButton': 'onClickCancel'
		},

		initialize: function(options) {
			this.url = options.url;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings
			}));

			return this;
		},

		onClickSave: function(event) {
			event.preventDefault();
			HubService.shutdown(this, this.url).
				success(function(response) {
                    toastr.success(strings.HubShuttingDown);
				}).
	            fail(function(response) {
	                if (response.status === 202) {
	                    toastr.success(strings.HubShuttingDown);
	                } else {
	                    toastr.error(strings.HubShutdownError);
	                }
	            });
			this.$el.foundation('reveal', 'close');
		},

		onClickCancel: function(event) {
			this.$el.foundation('reveal', 'close');
		}

	});

});