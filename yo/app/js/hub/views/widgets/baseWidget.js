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

		/**
		 * This will return a version of the ID that is safe to use in HTML ID attributes.
		 */
		getSafeId: function() {
			return this.model && this.model['@id'] ? this.model['@id'].replace('.', '-').replace('#', '-') : null;
		},

		getValue: function() {
			return this.$el.find('input#' + this.getSafeId()).val();
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
				this.$el.find('input#' + this.getSafeId()).addClass('error');
			} else {
				this.$el.find('label').removeClass('error');
				this.$el.find('input#' + this.getSafeId()).removeClass('error');
			}
		}

	});

});
