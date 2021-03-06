define(['js/services/url'], function (url) {

  describe('get query param', function () {
    it('should work correctly', function () {
      expect(url.getQueryParam('http://localhost/index.html', 'error')).toBe(null);
      expect(url.getQueryParam('http://localhost/index.html?foo=bar&error=foo', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?foo=bar&error=foo#devices', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?error=foo', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?error=foo#devices', 'error')).toBe('foo');
      expect(url.getQueryParam('http://localhost/index.html?error=foo&error_description=bar', 'error_description')).toBe('bar');
      expect(url.getQueryParam('http://localhost:9000/#devices?error=invalid_request&error_description=Invalid+username+and%2For+password.', 'error_description')).toBe('Invalid+username+and%2For+password.');
    });
  });

  describe('remove query param', function () {
    it('should work correctly', function () {
      expect(url.removeQueryParam('http://localhost/index.html', 'error')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?foo=bar&error=foo', 'error')).toBe('http://localhost/index.html?foo=bar');
      expect(url.removeQueryParam('http://localhost/index.html?foo=bar&error=foo#devices', 'error')).toBe('http://localhost/index.html?foo=bar#devices');
      expect(url.removeQueryParam('http://localhost/index.html?error=foo', 'error')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?error=foo#devices', 'error')).toBe('http://localhost/index.html#devices');

      expect(url.removeQueryParam('http://localhost/index.html', 'code')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?code=foo', 'code')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?code=foo#devices', 'code')).toBe('http://localhost/index.html#devices');

      expect(url.removeQueryParam('http://localhost/index.html#access_token=foo', 'access_token')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html?code=foo#access_token=bar', 'access_token')).toBe('http://localhost/index.html?code=foo');
      expect(url.removeQueryParam('http://localhost/index.html#access_token=foo?code=bar', 'access_token')).toBe('http://localhost/index.html?code=bar');
      expect(url.removeQueryParam('http://localhost/index.html', 'access_token')).toBe('http://localhost/index.html');
      expect(url.removeQueryParam('http://localhost/index.html#devices#access_token=foo', 'access_token')).toBe('http://localhost/index.html#devices');
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



