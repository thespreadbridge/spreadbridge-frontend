import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

const handler = vm.runInNewContext(readFileSync(new URL('../infra/cloudfront/www-canonical.js', import.meta.url), 'utf8') + '\nhandler;');
const request = (uri: string, querystring = {}, host = 'www.thespreadbridge.com') => ({ request: { uri, querystring, headers: { host: { value: host } }, method: 'GET' } });
describe('legacy www canonical redirect', () => {
  it.each([['/', '/'], ['/blog/example', '/blog/example/'], ['/privacy/index.html', '/privacy/'], ['/guide.html', '/guide/'], ['/sitemap.xml', '/sitemap.xml']])('redirects the public page %s to the current canonical site', (path, expected) => {
    expect(handler(request(path))).toMatchObject({ statusCode: 308, headers: { location: { value: 'https://thespreadbridge.com' + expected } } });
  });
  it('preserves encoded campaign tags and repeated query values without double encoding', () => {
    const result = handler(request('/blog/example/', { utm_campaign: { value: '%EB%9F%B0%EC%B9%AD' }, x: { value: 'one', multiValue: [{ value: 'one' }, { value: 'two' }] } }));
    expect(result.headers.location.value).toBe('https://thespreadbridge.com/blog/example/?utm_campaign=%EB%9F%B0%EC%B9%AD&x=one&x=two');
  });
  it.each(['/downloads/v1.0.0/Spreadbridge.zip', '/desktop/latest.json', '/releases/v1/app.exe', '/assets/app.js'])('keeps the static download/asset %s on its original distribution', path => {
    expect(handler(request(path)).uri).toBe(path);
    expect(handler(request(path))).not.toHaveProperty('statusCode');
  });
  it('keeps existing directory routing and does not rewrite another hostname', () => {
    expect(handler(request('/downloads/')).uri).toBe('/downloads/index.html');
    expect(handler(request('/guide/', {}, 'other.example.test')).uri).toBe('/guide/index.html');
  });
});
