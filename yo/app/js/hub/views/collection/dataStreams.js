// Filename: views/collection/dataStreams.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'views/collection/dataStream',
	'i18n!nls/strings'
], function($, _, Backbone, toastr, DataStreamView, strings) {

	return Backbone.View.extend({

		tagName: 'ul',

		className: 'small-block-grid-1 medium-block-grid-2 large-block-grid-3',

		initialize: function() {
			this.subviews = [];
		},

		remove: function() {
			for (var ix in this.subviews) {
				this.subviews[ix].remove();
				this.subviews[ix] = null;
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			if (this.model && this.model.length > 0) {
				for (var i=0; i < this.model.length; i++) {
					var ds = this.model.at(i);
					var v = new DataStreamView({model: ds});
					this.$el.append(v.render().el);
					this.subviews.push(v);
				}
			} else {
				this.$el.html(
					'<p class="notice">' + strings.NoDataStreamsCreated + '</p>'
				);
			}
			return this;
		}

	});

});