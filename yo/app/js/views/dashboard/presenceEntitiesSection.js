// Filename: views/dashboard/presenceEntitiesSection.js
define([
	'jquery',
	'underscore',
	'backbone',
	'bridget',
	'masonry',
	'views/dashboard/section',
	'views/dashboard/tiles/presenceEntity',
	'i18n!nls/strings',
	'text!templates/dashboard/tileGroup.html'
], function($, _, Backbone, bridget, Masonry, Section, PresenceEntityView, strings, template) {

	return Section.extend({

		initialize: function(options) {
			options.template = template;
			Section.prototype.initialize.call(this, options);
			this.type = 'presence';
			bridget('masonry', Masonry);
		},

		renderSection: function(model) {
			var tilesAdded = false;

			// add any potentially new entity tiles
			for (var ix=0; ix < model.length; ix++) {
				var d = model.at(ix);
				var sv = this.subviews[d.get('@id')];
				if (sv) {
					sv.model = d;
				} else {
					this.addPresenceEntityView(d);
					tilesAdded = true;
				}
			}

			// render all subviews
			for (var ix in this.subviews) {
				this.subviews[ix].render();
			}

			// force masonry to re-layout the tile grid if tiles were added
			if (tilesAdded) {
				$('.dash-tiles').masonry({
					itemSelector: '.tile',
					gutter: 10
				});
			}
		},

		addPresenceEntityView: function(entity) {
			if (entity && !this.subviews[entity.get('@id')]) {
				var tileView = new PresenceEntityView({model: entity});
				this.$el.find('.dash-tiles').append(tileView.render().el);
				this.subviews[entity.get('@id')] = tileView;
				this.subviewCount++;
			}
		}		

	});

});