// Viewer request for the legacy www distribution. Keep immutable files on S3.
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var downloadPath = /^\/(downloads|desktop|releases|updates|installers)(\/|$)/i.test(uri);
  var page = !/\.[a-z0-9]+$/i.test(uri) || /\.html$/i.test(uri)
    || /^\/(robots\.txt|sitemap\.xml|feed\.xml)$/i.test(uri);
  if (request.headers.host.value === 'www.thespreadbridge.com' && page && !downloadPath) {
    var path = uri.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '/');
    if (path !== '/' && path.charAt(path.length - 1) !== '/' && !/\.[a-z0-9]+$/i.test(path)) path += '/';
    var parts = [];
    for (var key in request.querystring) {
      if (!Object.prototype.hasOwnProperty.call(request.querystring, key)) continue;
      var item = request.querystring[key];
      var values = item.multiValue || [item];
      for (var i = 0; i < values.length; i++) parts.push(key + '=' + values[i].value);
    }
    return {
      statusCode: 308, statusDescription: 'Permanent Redirect',
      headers: {
        location: { value: ('https://thespreadbridge.com' + path + (parts.length ? '?' + parts.join('&') : '')).replace(/[\r\n]/g, '') },
        'cache-control': { value: 'no-store' }
      }
    };
  }
  // Retain the existing static object/directory routing for installers and assets.
  if (uri.endsWith('/')) request.uri += 'index.html';
  else if (!uri.split('/').pop().includes('.')) request.uri += '/index.html';
  return request;
}
