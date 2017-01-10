// Filename: views/device/sensorTile.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/variable',
	'views/device/baseStatus',
	'i18n!nls/strings',
	'text!templates/device/sensorTile.html'
], function($, _, Backbone, toastr, Variable, BaseStatusView, strings, template) {

	return Backbone.View.extend({

		tagName: 'li',

		template: _.template(template),

		render: function(el) {
		  // set battery level if necessary
		  var batteryLevel = null;
		  if (this.model.name === 'battery') {
        var l = this.model.value;
        if (l > 75) {
          batteryLevel = 4;
        } else if (l > 50) {
          batteryLevel = 3;
        } else if (l > 25) {
          batteryLevel = 2;
        } else if (l > 0) {
          batteryLevel = 1;
        } else {
          batteryLevel = 0;
        }
      }

      // render the tile
			this.$el.html(this.template({
				model: this.model,
        batteryLevel: batteryLevel,
				strings: strings
			}));
			return this;
		}

	});

});
