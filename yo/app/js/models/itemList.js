// Filename: collections/itemList.js
define([
	'backbone'
], function(Backbone) {
	return Backbone.Collection.extend({
		initialize: function(data, options) {
			this.url = options != null ? options.url : null;
			this.model = options.model;
			if (options != null && options.sort) {
				this.comparator = function(item) {
					return item.get(options.sort);
				};
			}
		},

		parse: function(response) {
			var results = [];
			if (response && response.itemListElement) {
				for (var i=0; i < response.itemListElement.length; i++) {
					var item = response.itemListElement[i].item;
					results.push(new this.model(item));
				}
			}
			return results;
		},

		filteredList: function(propName, propValue) {
	        filtered = this.filter(function (item) {
	            return item.get(propName) === propValue;
	        });
	        return new ItemList(filtered, null);
	    }
	});
});