define(['js/services/url'], function (url) {

  describe('get query param', function () {
    it('should work correctly', function () {
      expect(url.getQueryParam('http://localhost/index.html', 'error')).toBe(null);
      expect(url.getQueryParam('http://localhost/index.html?foo=bar&error=foo', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?foo=bar&error=foo#dashboard', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?error=foo', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?error=foo#dashboard', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?error=foo&error_description=bar', 'error_description')).toBe('bar');
    });
  });

  describe('remove query param', function () {
    it('should work correctly', function () {
      expect(url.removeQueryParam('http://localhost/index.html', 'error')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?foo=bar&error=foo', 'error')).toBe('http://localhost/index.html?foo=bar');
      expect(url.removeQueryParam('http://localhost/index.html?foo=bar&error=foo#dashboard', 'error')).toBe('http://localhost/index.html?foo=bar#dashboard');
      expect(url.removeQueryParam('http://localhost/index.html?error=foo', 'error')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?error=foo#dashboard', 'error')).toBe('http://localhost/index.html#dashboard');

      expect(url.removeQueryParam('http://localhost/index.html', 'code')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?code=foo', 'code')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?code=foo#dashboard', 'code')).toBe('http://localhost/index.html#dashboard');

      expect(url.removeQueryParam('http://localhost/index.html#access_token=foo', 'access_token')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?code=foo#access_token=bar', 'access_token')).toBe('http://localhost/index.html?code=foo');
      expect(url.removeQueryParam('http://localhost/index.html#access_token=foo?code=bar', 'access_token')).toBe('http://localhost/index.html?code=bar');
      expect(url.removeQueryParam('http://localhost/index.html', 'access_token')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html#dashboard#access_token=foo', 'access_token')).toBe('http://localhost/index.html#dashboard');
    });
  });

  describe('extract access token', function () {
    it('should work correctly', function () {
      expect(url.extractAccessToken('http://localhost/index.html#access_token=foo')).toBe('foo');
      expect(url.extractAccessToken('http://localhost/index.html?code=foo#access_token=bar')).toBe('bar');
      expect(url.extractAccessToken('http://localhost/index.html?code=foo#access_token=bar&id_token=foo')).toBe('bar');
      expect(url.extractAccessToken('http://localhost/index.html')).toBe(null);
      expect(url.extractAccessToken('http://localhost/index.html?code=foo')).toBe(null);
    });
  });

});



