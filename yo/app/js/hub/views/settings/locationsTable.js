// Filename: views/locationsTable.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'services/hub',
	'views/settings/location',
	'i18n!nls/strings'
], function($, _, Backbone, toastr, HubService, LocationView, strings) {

	return Backbone.View.extend({
		tagName: 'table',
		
		attributes: {
			width: '100%'
		},

		events: {
			'deleteClick': 'onDeleteClick'
		},

		initialize: function() {
			this.subviews = [];
		},

		remove: function() {
			for (var i=0; i < this.subviews.length; i++) {
				this.subviews[i].remove();
			}
			Backbone.View.prototype.remove.call(this);
		},

		render: function() {
			this.$el.html('<thead><td width="5%"></td><td>Name</td><td>Type</td><td width="5%"></td></thead>');
			if (this.model.length > 0) {
				for (var i = 0; i < this.model.length; i++) {
					var v = new LocationView({model: this.model.at(i)});
					this.$el.append(v.render().el);
					this.subviews.push(v);
				}
			} else {
				this.$el.append('<tr><td class="text-center" style="padding: 25px;" colspan="5">' + strings.NoLocations + '</td></tr>');
			}
			return this;
		},

		onDeleteClick: function(e, location) {
			e.preventDefault();
			if (confirm(strings.AreYouSureYouWantToDelete + ' \"' + location.get('name') + '\"?')) {
				HubService.deletePresenceLocation(this, location.get('@id'))
					.fail(function(response) {
						if (response.status === 202) {
							toastr.success(strings.LocationDeleted);
							this.$el.trigger('entityDeleted', location);
						} else {
							toastr.error(strings.LocationDeletedError);
						}
					});
			}
		}

	});

});