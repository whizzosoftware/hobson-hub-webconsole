// Filename: views/tasks/taskControlEditPanel.js
define([
	'jquery',
	'underscore',
	'backbone',
	'datetimepicker',
	'views/widget/datePicker',
	'views/widget/timePicker',
	'views/widget/recurrencePicker',
	'i18n!nls/strings',
	'text!templates/tasks/taskControlEditPanel.html',
	'text!templates/tasks/taskControlPropertyField.html'
], function($, _, Backbone, DateTimePicker, DatePickerView, TimePickerView, RecurrencePickerView, strings, template, fieldTemplate) {

	var TaskControlEditPanelView = Backbone.View.extend({

		template: _.template(template),

		fieldTemplate: _.template(fieldTemplate),

		events: {
			'click #buttonAdd': 'onClickAdd'
		},

		subviews: [],

		initialize: function(options) {
			this.control = options.control;
		},

		remove: function() {
			for (var i=0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			// render panel
			this.$el.html(this.template({
				strings: strings,
				control: this.control.toJSON()
			}));

			// render form
			var el = this.$el.find('form');
			var properties = this.control.get('properties');
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
			var properties = this.control.get('properties');
			for (var i=0; i < properties.length; i++) {
				var prop = properties[i];
				console.debug(prop.id);
				values[prop.id] = {value: this.$el.find('input#' + prop.id).val()};
			}

			// fire an "add clicked" event containing the control id and form values
			var val = {
				id: this.control.get('id'),
				properties: values
			};

			if (this.control.get('pluginId')) {
				val.pluginId = this.control.get('pluginId');
			}

			this.$el.trigger('onClickAdd', val);
		}

	});

	return TaskControlEditPanelView;
});