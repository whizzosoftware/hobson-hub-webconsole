// Filename: collections/itemList.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Collection.extend({

		initialize: function(options) {
			this.url = options.url;
			this.model = options.model;
			if (options.sort) {
				this.comparator = function(item) {
					return item.get(options.sort);
				};
			}
		},

		parse: function(response) {
			var results = [];
			if (response.itemListElement) {
				for (var i=0; i < response.itemListElement.length; i++) {
					var item = response.itemListElement[i].item;
					results.push(new this.model(item));
				}
			}
			return results;
		}

	});

});