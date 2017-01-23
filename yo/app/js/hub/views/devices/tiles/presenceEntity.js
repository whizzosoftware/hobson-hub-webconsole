// Filename: views/dashboard/tiles/presenceEntity.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
  'views/devices/tiles/tile',
	'i18n!nls/strings',
	'text!templates/devices/tiles/presenceEntity.html'
], function($, _, Backbone, toastr, TileView, strings, template) {

	return TileView.extend({
		tagName: 'div',

		template: _.template(template),

		className: "tile shadow-1",

		remove: function() {
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html(this.template({
				entity: this.model.toJSON(),
				strings: strings
			}));
			this.updateState();
			return this;
		},

    updateState: function() {
      TileView.prototype.updateState.bind(this).call();

      this.$el.find('.tile-header').html(this.model.get('location') && this.model.get('location').name ? this.model.get('location').name : 'Unknown');
    }

  });

});
