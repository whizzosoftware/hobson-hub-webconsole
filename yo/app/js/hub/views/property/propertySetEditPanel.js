// Filename: views/property/propertySetEditPanel.js
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
	'text!templates/property/propertySetEditPanel.html'
], function($, _, Backbone, PropertyContainer, DatePickerView, TimePickerView, RecurrencePickerView, DevicesPickerView, ColorPickerView, StringPickerView, PresenceEntityPickerView, LocationPickerView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		initialize: function(options) {
			this.subviews = [];
			this.timeMode = options.timeMode;
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
			console.log('rendering supported properties', properties);
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
							mode: this.timeMode
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

		getValues: function() {
			var values = {};
			for (var i in this.subviews) {
				var view = this.subviews[i];
				var value = view.getValue();
				if (value) {
					values[view.getSafeId()] = value;
				}
			}
			return values;
		}

	});

});