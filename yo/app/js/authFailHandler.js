// Filename: authFailHandler.js
define([
	'backbone',
	'cookies'
], function(Backbone, Cookies) {
	return function() {
		console.debug('auth fail handler invoked');
		var frag = '#login';
		if (Cookies.get('Token')) {
			Cookies.expire('Token');
			frag += '?expired=true';
		}
		Backbone.history.navigate(frag, {trigger: true});
		location.reload();
	}
});