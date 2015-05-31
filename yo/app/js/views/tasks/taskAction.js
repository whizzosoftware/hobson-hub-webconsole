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
			switch (action.actionClassId) {
				case '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-core/actionClasses/log':
					return 'Log "' + action.properties.message.value + '"';
				case '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-core/actionClasses/email':
					return 'Send e-mail to ' + action.properties.recipientAddress.value + ' with subject "' + action.properties.subject.value + '"';
				case '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-core/actionClasses/turnOff':
					return 'Turn off ' + this.createDeviceListDescription(action.properties.devices.value);
				case '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-core/actionClasses/turnOn':
					return 'Turn on ' + this.createDeviceListDescription(action.properties.devices.value);
				case '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-core/actionClasses/setLevel':
					return 'Set level of ' + this.createDeviceListDescription(action.properties.devices.value) + ' to ' + action.properties.level.value + '%';
				case '/api/v1/users/local/hubs/local/plugins/com.whizzosoftware.hobson.hub.hobson-hub-core/actionClasses/setColor':
					return 'Set color of ' + this.createDeviceListDescription(action.properties.devices.value);
				default:
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