// Filename: views/tasks/taskControlEditPanel.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'views/widgets/datePicker',
	'views/widgets/timePicker',
	'views/widgets/recurrencePicker',
	'views/widgets/devicesPicker',
	'views/widgets/colorPicker',
	'i18n!nls/strings',
	'text!templates/tasks/taskControlEditPanel.html',
	'text!templates/tasks/taskControlPropertyField.html'
], function($, _, Backbone, DateTimePicker, DatePickerView, TimePickerView, RecurrencePickerView, DevicesPickerView, ColorPickerView, strings, template, fieldTemplate) {

	var TaskControlEditPanelView = Backbone.View.extend({

		template: _.template(template),

		fieldTemplate: _.template(fieldTemplate),

		events: {
			'click #buttonAdd': 'onClickAdd'
		},

		initialize: function() {
			this.subviews = [];
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
						var v = new DatePickerView(prop);
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'TIME') {
						var v = new TimePickerView(prop);
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'RECURRENCE') {
						var v = new RecurrencePickerView(prop);
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'DEVICES') {
						var v = new DevicesPickerView(prop);
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'DEVICE') {
						var v = new DevicesPickerView(prop, true);
						el.append(v.render().el);
						this.subviews.push(v);
					} else if (prop.type === 'COLOR') {
						var v = new ColorPickerView(prop);
						el.append(v.render().el);
						this.subviews.push();
					} else {
						el.append(this.fieldTemplate({
							strings: strings,
							property: prop
						}));
					}
				}
			}

			return this;
		},

		onClickAdd: function(e) {
			e.preventDefault();
			
			// build a list of form values
			var values = {};
			var properties = this.model.get('supportedProperties');
			for (var i=0; i < properties.length; i++) {
				var prop = properties[i];
				if (prop.type === 'DEVICES' || prop.type === 'DEVICE') {
					values[prop['@id']] = prop.value;
				} else {
					values[prop['@id']] = this.$el.find('input#' + prop['@id']).val();
				}
			}

			// fire an "add clicked" event containing the control id and form values
			var val = {
				id: this.model.get('@id'),
				type: this.model.get('type'),
				descriptionTemplate: this.model.get('descriptionTemplate'),
				supportedProperties: properties, 
				properties: values
			};

			this.$el.trigger('onClickAdd', val);
		}

	});

	return TaskControlEditPanelView;
});