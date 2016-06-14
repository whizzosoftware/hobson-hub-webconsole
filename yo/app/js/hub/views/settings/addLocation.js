// Filename: views/settings/addLocation.js
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone.validation',
	'backbone.stickit',
	'toastr',
	'services/hub',
	'i18n!nls/strings',
	'text!templates/settings/addLocation.html'
], function($, _, Backbone, Validation, Stickit, toastr, HubService, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'click #cancelButton': 'onCancelButton',
			'click #addButton': 'onAddButton',
			'change #type': 'onTypeChange'
		},

		bindings: {
			'#name': 'name',
			'#type': 'type',
			'#latitude': 'latitude',
			'#longitude': 'longitude',
			'#radius': 'radius',
			'#beaconMajor': 'beaconMajor',
			'#beaconMinor': 'beaconMinor'
		},

		initialize: function() {
			this.model = HubService.createNewPresenceLocation();
			this.model.set('type', 'map');
			Validation.bind(this);
		},

		remove: function() {
			Validation.unbind(this);
			this.unstickit();
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings
			}));

			this.stickit();

			return this;
		},

		clearForm: function() {
			for (var ix in this.bindings) {
				var s = this.bindings[ix];

				// clear model value
				if (ix !== '#type' && ix !== '#name') {
					this.model.set(s, null);
				}

				// clear error notification
				var el = this.$el.find('#' + s);
				el.removeClass('error');
				this.$el.find('#' + s + 'Error').css('display', 'none');
			}
		},

		onTypeChange: function(event) {
			var val = $(event.target).val();
			this.$el.find('#mapInfo').css('display', val === 'map' ? 'block' : 'none');
			this.$el.find('#beaconInfo').css('display', val === 'beacon' ? 'block' : 'none');
			this.clearForm();
		},

		onCancelButton: function(event) {
			event.preventDefault();
			this.$el.foundation('reveal', 'close');
		},

		onAddButton: function(event) {
			event.preventDefault();

			this.model.validate();

			// if valid, save the model
			if (this.model.isValid()) {
				this.model.save(null, {
					context: this,
					success: null,
					error: function(model, response, options) {
						options.context.$el.foundation('reveal', 'close');
						if (response.status === 202) {
							toastr.success(strings.LocationCreated);
						} else {
							toastr.error(strings.LocationCreatedFailed);
						}
					}
				});
			}
		}

	});

});