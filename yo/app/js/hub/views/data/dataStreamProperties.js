// Filename: views/data/dataStreamView.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/device',
	'views/data/variableSelectorPanel',
	'views/data/dataStreamVariables',
	'i18n!nls/strings',
	'text!templates/data/dataStreamProperties.html'
], function($, _, Backbone, toastr, DeviceService, VariableSelectorPanelView, DataStreamVariablesView, strings, template) {

	return Backbone.View.extend({

		template: _.template(template),

		events: {
			'click #buttonPlus': 'onClickPlus',
			'addField': 'onFieldAdded',
			'deleteField': 'onFieldDeleted'
		},

		initialize: function(options) {
			this.model = [];
		},

		remove: function() {
			if (this.variableSelector) {
				this.variableSelector.remove();
			}
			if (this.dataStreamVariables) {
				this.dataStreamVariables.remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.append(this.template({
				strings: strings
			}));

			this.renderVariables();

			return this;
		},

		renderVariables: function() {
			if (this.dataStreamVariables) {
				this.dataStreamVariables.remove();
			}
			this.dataStreamVariables = new DataStreamVariablesView({
				model: this.model
			});
			this.$el.find('#variables').html(this.dataStreamVariables.render().el);
		},

		closePlusPanel: function() {
			this.$el.find('#buttonPlus').removeClass('active');
			this.$el.find('#variableSelectorPanel').css('display', 'none');
			this.variableSelector.remove();
		},

		onClickPlus: function(e) {
			var el = this.$el.find('#variableSelectorPanel');

			if (el.css('display') === 'none') {
				el.css('display', 'block');
				$(e.target).addClass('active');

				this.variableSelector = new VariableSelectorPanelView({
					required: true,
					single: true
				});
				el.html(this.variableSelector.render().el);
			} else {
				this.closePlusPanel();
			}
		},

		onFieldAdded: function(e, field) {
      console.log('onFieldAdded', field);
      this.model.push({
        name: field.name,
        variable: {
          "@id": field.variable.value[0]['@id']
        }
      });
      console.log('current model value', this.model);
			this.closePlusPanel();
			this.renderVariables();
		},

		onFieldDeleted: function(e, field) {
			for (var ix in this.model) {
				if (this.model[ix].name === field.name) {
					this.model.splice(ix, 1);
					this.renderVariables();
					break;
				}
			}
		}

	});

});
