// Filename: views/pluginConfig
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/propertyContainer',
	'views/widgets/stringPicker',
	'views/widgets/devicesPicker',
	'i18n!nls/strings',
	'text!templates/settings/pluginSettings.html'
], function($, _, Backbone, toastr, Config, StringPropertyView, DevicesPropertyView, strings, pluginSettingsTemplate) {

	var PluginConfigView = Backbone.View.extend({

		template: _.template(pluginSettingsTemplate),

		events: {
			'click #saveButton': 'onClickSave',
			'click #cancelButton': 'onClickCancel'
		},

		subviews: [],

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({
				strings: strings,
				plugin: this.model.toJSON()
			}));

			var formEl = this.$el.find('form');

			var properties = this.model.get('configurationClass').supportedProperties;
			for (var ix in properties) {
				var property = properties[ix];
        var v;
        switch (property.type) {
          case 'STRING':
          case 'SECURE_STRING':
            v = new StringPropertyView({
              id: property['@id'],
              property: property,
              value: this.model.get('configuration').values[property['@id']]
            });
            break;
          case 'DEVICE':
            v = new DevicesPropertyView(property, true);
            break;
        }
        if (v) {
          formEl.append(v.render().el);
          this.subviews.push(v);
        }
			}

			return this;
		},

		onClickSave: function(event) {
			event.preventDefault();
			var config = new Config({url: this.model.get('configuration')['@id']});
			config.set('cclass', {
				'@id': this.model.get('configurationClass')['@id']
			});
			for (var i=0; i < this.subviews.length; i++) {
				var v = this.subviews[i];
				config.setProperty(v.getId(), v.getValue());
			}
			config.set('id', this.model.get('@id'));
			config.save(null, {
				error: function(model, response) {
					if (response.status === 202) {
						toastr.success(strings.PluginConfigurationSaved);
					} else {
						toastr.error(strings.PluginConfigurationNotSaved);
					}
				}
			});
			this.$el.foundation('reveal', 'close');
		},

		onClickCancel: function(event) {
			event.preventDefault();
			this.$el.foundation('reveal', 'close');
		}

	});

	return PluginConfigView;
});
