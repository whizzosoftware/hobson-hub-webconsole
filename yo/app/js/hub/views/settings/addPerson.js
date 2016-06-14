// Filename: views/settings/addPerson.js
define([
	'jquery',
	'underscore',
	'backbone',
	'backbone.validation',
	'backbone.stickit',
	'toastr',
	'services/hub',
	'models/presenceEntity',
	'i18n!nls/strings',
	'text!templates/settings/addPerson.html'
], function($, _, Backbone, Validation, Stickit, toastr, HubService, PresenceEntity, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'click #cancelButton': 'onCancelButton',
			'click #saveButton': 'onSaveButton'
		},

		bindings: {
			'#name': 'name'
		},

		initialize: function() {
			this.model = HubService.createNewPresenceEntity();
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

		onCancelButton: function(event) {
			event.preventDefault();
			this.$el.foundation('reveal', 'close');
		},

		onSaveButton: function(event) {
			event.preventDefault();

			// update and validate model
			this.model.validate();

			// if the model is valid, save it
			if (this.model.isValid()) {
				this.model.save(null, {
					context: this,
					success: null,
					error: function(model, response, options) {
						options.context.$el.foundation('reveal', 'close');
						if (response.status === 202) {
							toastr.success(strings.PersonCreated);
						} else {
							toastr.error(strings.PersonCreatedError);
						}
					}
				});
			}
		}

	});

});