// Filename: models/propertyContainer.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Model.extend({

		initialize: function(options) {
			this.url = options.url;
			this.set('values', {});
		},

		setProperty: function(key, value) {
			this.get('values')[key] = value;
		},

		/** 
		 * Validates the configuration against a list of supported properties.
		 * @param {Object} supportedProperties
		 * @return null if validation successful or an array of property IDs that failed validation
		 */
		validate: function(supportedProperties) {
			var fields = [];
			for (var ix in supportedProperties) {
				var sp = supportedProperties[ix];
				var pid = sp['@id'];
				if (sp.constraints && sp.constraints['required'] && !this.get('values')[pid]) {
					fields.push(pid);
				}
			}
			if (fields.length > 0) {
				return fields;
			} else {
				return null;
			}
		}

	});
});