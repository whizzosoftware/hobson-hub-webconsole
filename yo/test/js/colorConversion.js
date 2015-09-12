define(['app/js/services/colorConversion.js'], function(colorConversion) {
	describe('colorConversion', function() {
		it('should convert rgb values', function() {
			console.debug(colorConversion.covertRgbToBytes('rgb(255,255,255)'));
		});
	});
});