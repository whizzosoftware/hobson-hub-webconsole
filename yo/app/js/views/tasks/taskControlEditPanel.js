// Filename: views/tasks/taskControlEditPanel.js
define([
	'jquery',
	'underscore',
	'backbone',
	'models/propertyContainer',
	'views/widgets/datePicker',
	'views/widgets/timePicker',
	'views/widgets/recurrencePicker',
	'views/widgets/devicesPicker',
	'views/widgets/colorPicker',
	'views/widgets/stringPicker',
	'views/widgets/presenceEntityPicker',
	'views/widgets/locationPicker',
	'i18n!nls/strings',
	'text!templates/tasks/taskControlEditPanel.html',
	'text!templates/tasks/taskControlPropertyField.html'
], function($, _, Backbone, PropertyContainer, DatePickerView, TimePickerView, RecurrencePickerView, DevicesPickerView, ColorPickerView, StringPickerView, PresenceEntityPickerView, LocationPickerView, strings, template, fieldTemplate) {

	return Backbone.View.extend({

		template: _.template(template),

		fieldTemplate: _.template(fieldTemplate),

		events: {
			'click #buttonAdd': 'onClickAdd'
		},

		initialize: function(options) {
			this.subviews = [];
			this.showSun = options.showSun;
		},

		remove: function() {
			for (var i = 0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			this.subviews.length = 0;
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			// render panel
			this.$el.html(this.template({
				strings: strings,
				control: this.model.toJSON()
			}));

			// render form
			var el = this.$el.find('form');
			var properties = this.model.get('supportedProperties');
			if (properties) {
				for (var i=0; i < properties.length; i++) {
					var prop = properties[i];

					if (prop.type === 'DATE') {
						var v = new DatePickerView({
							model: prop
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'TIME') {
						var v = new TimePickerView({
							model: prop,
							showSun: this.showSun
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'RECURRENCE') {
						var v = new RecurrencePickerView({
							model: prop
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'DEVICES') {
						var v = new DevicesPickerView({
							model: prop
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'DEVICE') {
						var v = new DevicesPickerView({
							model: prop, 
							single: true
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'COLOR') {
						var v = new ColorPickerView({
							model: prop
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'PRESENCE_ENTITY') {
						var v = new PresenceEntityPickerView({
							model: prop
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'LOCATION') {
						var v = new LocationPickerView({
							model: prop
						});
						el.append(v.render().el);
						this.subviews.push(v);
					} else {
						var v = new StringPickerView({
							model: prop
						});
						el.append(v.render().el);
						this.subviews.push(v);
					}
				}
			}

			return this;
		},

		onClickAdd: function(e) {
			e.preventDefault();
			
			// build a list of form values
			var values = new PropertyContainer({url: this.model.get('@id')});
			for (var i=0; i < this.subviews.length; i++) {
				var v = this.subviews[i];
				v.showError(false);
				values.setProperty(v.getId(), v.getValue());
			}

			// validate them
			var properties = this.model.get('supportedProperties');
			var fails = values.validate(properties);

			// if there are validation failures, update the UI to show them
			if (fails) {
				for (var i=0; i < this.subviews.length; i++) {
					var v = this.subviews[i];
					if (fails.indexOf(v.getId()) > -1) {
						v.showError(true);
					}
				}
			// otherwise, fire an event
			} else {
				var val = {
					id: this.model.get('@id'),
					type: this.model.get('type'),
					descriptionTemplate: this.model.get('descriptionTemplate'),
					supportedProperties: properties, 
					properties: values.get('values')
				};

				this.$el.trigger('onClickAdd', val);
			}

		},

	});

});