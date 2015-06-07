// Filename: views/tasks/taskAction.js
define([
	'jquery',
	'underscore',
	'backbone',
	'i18n!nls/strings',
	'text!templates/tasks/taskAction.html'
], function($, _, Backbone, strings, template) {

	var TaskConditionView = Backbone.View.extend({
		template: _.template(template),

		tagName: 'li',

		className: 'action',

		initialize: function(options) {
			this.action = options.action;
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				action: this.action,
				description: this.createDescription(this.action)
			}));
			return this;
		},

		createDescription: function(action) {
			console.debug('action:', action);

			var cclass = action.cclass['@id'];

			if (cclass.endsWith('log')) {
				return 'Log "' + action.values.message + '"';
			} else if (cclass.endsWith('email')) {
				return 'Send e-mail to ' + action.values.recipientAddress + ' with subject "' + action.values.subject + '"';
			} else if (cclass.endsWith('turnOff')) {
				return 'Turn off ' + this.createDeviceListDescription(action.values.devices);
			} else if (cclass.endsWith('turnOn')) {
				return 'Turn on ' + this.createDeviceListDescription(action.values.devices);
			} else if (cclass.endsWith('setLevel')) {
				return 'Set level of ' + this.createDeviceListDescription(action.values.devices) + ' to ' + action.values.level + '%';
			} else if (cclass.endsWith('setColor')) {
				return 'Set color of ' + this.createDeviceListDescription(action.values.devices);
			} else {
				return action.name;
			}
		},

		createDeviceListDescription: function(devices) {
			if (devices.length === 1) {
				return devices[0].name;
			} else if (devices.length === 2) {
				return devices[0].name + ' and ' + devices[1].name;
			} else if (devices.length > 2) {
				return devices[0].name + ' and ' + (devices.length - 1) + ' other devices';
			}
		}

	});

	return TaskConditionView;
});