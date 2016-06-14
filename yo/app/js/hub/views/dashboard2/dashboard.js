// Filename: views/dashboard2/dashboard.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'gridster',
	'i18n!nls/strings',
	'text!templates/dashboard2/dashboard.html'
], function($, _, Backbone, toastr, gridster, strings, template) {

	return Backbone.View.extend({
		tagName: 'div',
		template: _.template(template),

		render: function() {
			// create dashboard shell
			this.$el.html(this.template({strings: strings}));
			_.defer(function(v) {
				// initialize gridster
				var gridster = v.$el.find('.gridster ul').gridster({
					widget_margins: [5,5],
					widget_base_dimensions: [300, 100],
					min_cols: 3,
					max_cols: 3,
					resize: {
						enabled: true
					}
				}).data('gridster');
				var widgets = [
			          ['<li style="background: red;">0</li>', 1, 1],
			          ['<li style="background: green;">1</li>', 1, 1],
			          ['<li style="background: blue;">2</li>', 1, 1],
			          ['<li style="background: yellow;">3</li>', 1, 1],
			          ['<li style="background: orange;">4</li>', 1, 1],
			      ];

				$.each(widgets, function(i, widget){
				  gridster.add_widget.apply(gridster, widget)
				});
			}, this);

			return this;
		},
	});

});	