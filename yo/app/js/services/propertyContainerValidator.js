// Filename: services/propertyContainerValidator.js
define([
	'jquery',
	'i18n!nls/strings'
], function($, strings) {

	return {

		validate: function(a) {
			for (var ix in a.cclass.supportedProperties) {
				var sp = a.cclass.supportedProperties[ix];
				var varName = sp['@id'];
				if (!_.has(a.values, varName)) {
					return sp.name + ' ' + strings.IsARequiredField + '.';
				} else {
					var value = a.values[varName];
					switch (sp.type) {
						case 'STRING':
							if (!_.isString(value) || value === '') {
								return sp.name + ' ' + strings.MustBeAValidString + '.';
							}
							break;
						case 'NUMBER':
							if (value === '' || isNaN(value)) {
								return sp.name + ' ' + strings.MustBeAValidNumber + '.';
							}
							break;
						case 'DATE':
							if (value === '') {
								return sp.name + ' ' + strings.MustBeAValidDate + '.';
							}
							break;
						case 'TIME':
							if (value === '') {
								return sp.name + ' ' + strings.MustBeAValidTime + '.';
							}
							break;
						default:
							break;
					}
				}
			}
			return null;
		}

	};

});