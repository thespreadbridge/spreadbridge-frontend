export function apiBaseUrl() {
  const configured = process.env.SPREADBRIDGE_API_URL ?? process.env.API_INTERNAL_URL;
  const value = configured ?? 'https://api.thespreadbridge.com/v1';
  return value.replace(/\/$/, '');
}
export function backend(path: string, init: RequestInit = {}) {
  return fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    cache: 'no-store', redirect: init.redirect ?? 'error', signal: AbortSignal.timeout(10000),
  });
}
