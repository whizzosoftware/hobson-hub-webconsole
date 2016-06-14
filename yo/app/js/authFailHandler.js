// Filename: authFailHandler.js
define([
], function() {
	return function(authService) {
    console.debug('Auth failure detected; redirecting to login', authService);
    authService.redirectToLogin();
	}
});
