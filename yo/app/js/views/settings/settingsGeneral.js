// Filename: views/settings/settingsGeneral.js
define([
	'jquery',
	'underscore',
	'backbone',
	'toastr',
	'models/propertyContainer',
	'views/settings/settingsTab',
	'i18n!nls/strings',
	'text!templates/settings/settingsGeneral.html'
], function($, _, Backbone, toastr, Config, SettingsTab, strings, template) {

	var ProfileView = SettingsTab.extend({

		tabName: 'general',

		template: _.template(template),

		addressChange: false, // indicates that the user has changed the address field

		lookupPending: false, // indicates that an address lookup is in flight

		savePending: false, // indicates the user has clicked the save button but changes have not yet been committed

		events: {
			'blur input#hubAddress': 'onBlurAddress',
			'change input#hubAddress': 'onChangeAddress',
			'click [type="checkbox"]': 'onShowLatLong',
			'click a#button-save': 'onClickSave'
		},

		initialize: function(options) {
			this.addressChange = false;
		},

		renderTabContent: function(el) {
			var values = this.model.get('values');

			el.html(this.template({
				strings: strings,
				config: values
			}));

			if (values && values.address) {
				this.showMap(encodeURIComponent(values.address), 17, true);
			} else {
				this.showDefaultMap();
			}
		},

		onChangeAddress: function() {
			this.addressChange = true;
		},

		onShowLatLong: function(e) {
			$('#latLong').css('display', $(e.target).prop('checked') ? 'block' : 'none');
		},

		onBlurAddress: function() {
			// if the user has changed the address field...
			if (this.addressChange) {
				this.addressChange = false;

				// clear any prior address lookup failure
				this.showLookupFailure(false);

				// show the map loading indicator and disable the address fields so the user can't change them
				this.showMapLoader(true);
				this.disableAddressFields(true);
				
				// look up the address
				this.lookupPending = true;
				$.ajax('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(this.$el.find('#hubAddress').val()), {
					context: this,
					success: function(data, status, jqxhr) {
						this.lookupPending = false;
						if (data.length == 1 && data[0].lat && data[0].lon) {
							var addrData = data[0];
							this.$el.find('#hubLatitude').val(addrData.lat);
							this.$el.find('#hubLongitude').val(addrData.lon);
							this.showMap(addrData.lat + ',' + addrData.lon, 17, true);
							if (this.savePending) {
								this.onClickSave();
							}
						} else {
							this.showLookupFailure(true);
						}
					},
					fail: function(jqXHR, status, error) {
						this.lookupPending = false;
						this.showLookupFailure(true);
					}
				}).always(function() {
					this.disableAddressFields(false);
				});
			}
		},

		onClickSave: function(event) {
			if (event) {
				event.preventDefault();
			}

			// if there is no address lookup to wait for, save the new data
			if (!this.lookupPending) {
				this.savePending = false;

				// create a new hub model object
				var config = new Config({id: 'id', url: this.model.get('@id'), cclass: this.model.get('cclass')});
				config.setProperty('name', this.$el.find('#hubName').val());
				config.setProperty('address', this.$el.find('#hubAddress').val());

				// set the latitude/longitude if they've been entered
				var l = this.$el.find('#hubLatitude').val();
				if (l) {
					config.setProperty('latitude', l);
				}
				l = this.$el.find('#hubLongitude').val();
				if (l) {
					config.setProperty('longitude', l);
				}

				// save to server
				config.save(null, {
					error: function(model, response) {
						if (response.status === 202) {
							toastr.success('The hub configuration has been saved.')
						} else {
							toastr.error('The hub configuration could not be saved. See the log file for details.');
						}
					}
				});
			} else {
				this.savePending = true;
			}
		},

		disableAddressFields: function(disabled) {
			this.$el.find('#hubAddress').prop('disabled', disabled);
			var lat = this.$el.find('#hubLatitude');
			var lon = this.$el.find('#hubLongitude');
			if (disabled) {
				lat.val('');
				lon.val('');
			}
			lat.prop('disabled', disabled);
			lon.prop('disabled', disabled);
		},

		showMapLoader: function() {
			this.$el.find('#map-container').html('<p><i class="fa fa-spinner fa-2x fa-spin"></i>&nbsp;&nbsp;Looking up address...</p>');
		},

		showDefaultMap: function() {
			this.showMap(encodeURIComponent('Lebanon,KS'), 1, false);
		},

		showMap: function(addr, zoom, marker) {
			if (addr) {
				var url = '<center><img src="https://maps.googleapis.com/maps/api/staticmap?center=' + addr + '&zoom=' + zoom + '&size=400x400&maptype=roadmap';
				if (marker) {
					url += '&markers=color:0xffba00%7C' + addr;
				}
				url += '" /></center>';
				var img = $.parseHTML(url);
				this.$el.find('#map-container').html(img);
			}
		},

		showLatLong: function(show) {

		},

		showLookupFailure: function(show) {
			if (show) {
				this.showDefaultMap();
				this.$el.find('#addressLabel').addClass('error');
				this.$el.find('#hubAddress').addClass('error');
			} else {
				this.$el.find('#addressLabel').removeClass('error');
				this.$el.find('#hubAddress').removeClass('error');
			}
			this.$el.find('#addressError').css('display', show ? 'block' : 'none');
			this.$el.find('#showLatLong').attr('checked', show);
			this.$el.find('#latLong').css('display', show ? 'block' : 'none');
		}		

	});

	return ProfileView;
});