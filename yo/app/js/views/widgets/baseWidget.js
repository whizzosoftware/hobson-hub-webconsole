// Filename: views/widgets/baseWidget.js
define([
	'jquery',
	'backbone',
	'i18n!nls/strings',
], function($, Backbone, strings) {

	return Backbone.View.extend({

		getId: function() {
			return this.model['@id'];
		},

		getValue: function() {
			return this.$el.find('input#' + this.getId()).val();
		},

		showError: function(showError) {
			if (showError) {
				this.$el.find('label').addClass('error');
				var reqLabel = this.$el.find('label small');
				reqLabel.animate({
					fontSize: '120%'
				}, 250, 'swing', function() {
					reqLabel.animate({
						fontSize: '60%'
					}, 250);
				});
				this.$el.find('input#' + this.getId()).addClass('error');
			} else {
				this.$el.find('label').removeClass('error');
				this.$el.find('input#' + this.getId()).removeClass('error');
			}
		}

	});

});
