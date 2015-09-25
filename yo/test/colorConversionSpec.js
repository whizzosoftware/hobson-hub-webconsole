define(['js/services/colorConversion'], function (colorConversion) {
	
	describe('test color conversion to byte', function () {
		it('should work correctly', function () {
			expect(colorConversion.convertRgbToByte(255,0,0)).toBe(0);
			expect(colorConversion.convertRgbToByte(255,249,0)).toBe(41);
			expect(colorConversion.convertRgbToByte(255,255,0)).toBe(42);
			expect(colorConversion.convertRgbToByte(249,255,0)).toBe(43);
			expect(colorConversion.convertRgbToByte(6,255,0)).toBe(83);
			expect(colorConversion.convertRgbToByte(0,255,0)).toBe(84);
			expect(colorConversion.convertRgbToByte(0,255,6)).toBe(85);
			expect(colorConversion.convertRgbToByte(0,255,249)).toBe(125);
			expect(colorConversion.convertRgbToByte(0,255,255)).toBe(126);
			expect(colorConversion.convertRgbToByte(0,249,255)).toBe(127);
			expect(colorConversion.convertRgbToByte(0,6,255)).toBe(167);
			expect(colorConversion.convertRgbToByte(0,0,255)).toBe(168);
			expect(colorConversion.convertRgbToByte(6,0,255)).toBe(169);
			expect(colorConversion.convertRgbToByte(249,0,255)).toBe(209);
			expect(colorConversion.convertRgbToByte(255,0,255)).toBe(210);
			expect(colorConversion.convertRgbToByte(255,0,249)).toBe(211);
			expect(colorConversion.convertRgbToByte(255,0,6)).toBe(255);
			expect(colorConversion.convertRgbToByte(255,0,1)).toBe(256);
		});
    });

    describe('test color conversion from byte', function() {
		it('should work correctly', function() {
			expect(colorConversion.convertByteToRgb(0)).toBe('rgb(255,0,0)');
			expect(colorConversion.convertByteToRgb(21)).toBe('rgb(255,127,0)');
			expect(colorConversion.convertByteToRgb(42)).toBe('rgb(255,255,0)');
			expect(colorConversion.convertByteToRgb(63)).toBe('rgb(128,255,0)');
			expect(colorConversion.convertByteToRgb(83)).toBe('rgb(6,255,0)');
			expect(colorConversion.convertByteToRgb(84)).toBe('rgb(0,255,0)');
			expect(colorConversion.convertByteToRgb(85)).toBe('rgb(0,255,6)');
			expect(colorConversion.convertByteToRgb(125)).toBe('rgb(0,255,249)');
			expect(colorConversion.convertByteToRgb(126)).toBe('rgb(0,255,255)');
			expect(colorConversion.convertByteToRgb(127)).toBe('rgb(0,249,255)');
			expect(colorConversion.convertByteToRgb(167)).toBe('rgb(0,6,255)');
			expect(colorConversion.convertByteToRgb(168)).toBe('rgb(0,0,255)');
			expect(colorConversion.convertByteToRgb(209)).toBe('rgb(249,0,255)');
			expect(colorConversion.convertByteToRgb(210)).toBe('rgb(255,0,255)');
			expect(colorConversion.convertByteToRgb(211)).toBe('rgb(255,0,249)');
			expect(colorConversion.convertByteToRgb(212)).toBe('rgb(255,0,243)');
			expect(colorConversion.convertByteToRgb(255)).toBe('rgb(255,0,6)');
			expect(colorConversion.convertByteToRgb(256)).toBe('rgb(255,0,1)');
		});
    });
});



