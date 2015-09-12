// Filename: services/colorConversion.js
define([
], function($) {
	return {

		convertRgbToByte: function(r,g,b) {
			if (r == 255 && b == 0) {
				return Math.round(g / 6.07);
			} else if (g == 255 && b == 0) {
				return Math.round(-0.000005066002779064382*r*r-0.16341405164427975*r+84);
			} else if (r == 0 && g == 255) {
				return Math.round(0.000005066002779064382*b*b+0.16341405164427975*b+84);
			} else if (r == 0 && b == 255) {
				return Math.round(-0.000005066002779064382*g*g-0.16341405164427975*g+168);
			} else if (g == 0 && b == 255) {
				return Math.round(0.000005066002779064382*r*r+0.16341405164427975*r+168);
			} else if (r == 255 && g == 0) {
				return Math.round(0.000124000248000496*b*b-0.2128464256928514*b+256.21272242544484);
			} else {
				return 0;
			}
		},

		convertByteToRgb: function(val) {
			var r;
			var g;
			var b;

			switch (true) {
				case (val >= 0 && val < 42):
					r = 255; g = Math.round(6.07 * val); b = 0;
					break;
				case (val >= 42 && val < 84):
					r = Math.round(255-(6.07*(val-42))); g = 255; b = 0;
					break;
				case (val >= 84 && val < 126):
					r = 0; g = 255; b = Math.round(6.07*(val-84));
					break;
				case (val >= 126 && val < 168):
					r = 0; g = Math.round(255-(6.07*(val-126))); b = 255;
					break;
				case (val >= 168 && val < 210):
					r = Math.round(6.07*(val-168)); g = 0; b = 255;
					break;
				case (val >= 210 && val < 252):
					r = 255; g = 0; b = Math.round(255-(6.07*(val-210)));
					break;
				case (val >= 252):
					r = 255; g = 0; b = Math.round(0.007422046552481335*val*val-8.977206851119895*val+1812.7537110232763);
					break;
			}
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		}
	};
});