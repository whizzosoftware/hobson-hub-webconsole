// Filename: services/plugin.js
define([
	'jquery',
], function($) {
	
	var PluginService = {
		getPluginIcon: function(ctx, url) {
			return $.ajax({
				context: ctx,
				url: url + '?base64=true',
				type: 'GET'
			});
		}
	};

	return PluginService;
});