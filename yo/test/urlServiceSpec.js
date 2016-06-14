define(['js/services/url'], function (url) {

  describe('remove code', function () {
    it('should work correctly', function () {
      expect(url.removeCode('http://localhost/index.html')).toBe('http://localhost/index.html');
      expect(url.removeCode('http://localhost/index.html?code=foo')).toBe('http://localhost/index.html');
      expect(url.removeCode('http://localhost/index.html?code=foo#dashboard')).toBe('http://localhost/index.html#dashboard');
    });
  });

  describe('extract code', function () {
    it('should work correctly', function () {
      expect(url.extractCode('http://localhost/index.html')).toBe(null);
      expect(url.extractCode('http://localhost/index.html?code=foo')).toBe('foo');
      expect(url.extractCode('http://localhost/index.html?code=foo#dashboard')).toBe('foo');
    });
  });

  describe('extract access token', function () {
    it('should work correctly', function () {
      expect(url.extractAccessToken('http://localhost/index.html#access_token=foo')).toBe('foo');
      expect(url.extractAccessToken('http://localhost/index.html?code=foo#access_token=bar')).toBe('bar');
      expect(url.extractAccessToken('http://localhost/index.html')).toBe(null);
      expect(url.extractAccessToken('http://localhost/index.html?code=foo')).toBe(null);
    });
  });

  describe('remove access token', function () {
    it('should work correctly', function () {
      expect(url.removeAccessToken('http://localhost/index.html#access_token=foo')).toBe('http://localhost/index.html');
      expect(url.removeAccessToken('http://localhost/index.html?code=foo#access_token=bar')).toBe('http://localhost/index.html?code=foo');
      expect(url.removeAccessToken('http://localhost/index.html#access_token=foo?code=bar')).toBe('http://localhost/index.html?code=bar');
      expect(url.removeAccessToken('http://localhost/index.html')).toBe('http://localhost/index.html');
    });
  });

});



