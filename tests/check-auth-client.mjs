import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../frontend/js/auth-api.js', import.meta.url), 'utf8');
function loadClient(fetch) {
  const window = {};
  vm.runInNewContext(source, {
    window, URL, fetch,
    document: { currentScript: { src: 'http://localhost/project/frontend/js/auth-api.js' } },
  });
  return window.sportshubAuth;
}
const response = { ok: true, json: async () => ({ success: true, csrfToken: 'test-token', authenticated: true }) };

test('concurrent session checks share one request before cookies are restored', async () => {
  let count = 0;
  const client = loadClient(async () => { count++; return response; });
  const sessions = await Promise.all([client.session(), client.session(), client.session()]);
  assert.equal(count, 1);
  assert.ok(sessions.every(session => session.authenticated));
  await client.session();
  assert.equal(count, 2, 'later checks must still verify the current session');
});

test('a failed session check can be retried', async () => {
  let count = 0;
  const client = loadClient(async () => {
    if (++count === 1) throw new Error('Disconnected');
    return response;
  });
  await assert.rejects(client.session(), /Disconnected/);
  assert.equal((await client.session()).authenticated, true);
});

test('form submission obtains and sends the server CSRF token', async () => {
  const requests = [];
  const client = loadClient(async (url, options) => {
    requests.push({ url: String(url), options });
    return response;
  });
  await client.post('login', { identifier: 'student@example.test', password: 'test-password' });
  assert.equal(requests.length, 2);
  assert.match(requests[1].url, /\/project\/backend\/api\/auth\/login.php$/);
  assert.equal(requests[1].options.headers['X-CSRF-Token'], 'test-token');
  assert.equal(JSON.parse(requests[1].options.body).identifier, 'student@example.test');
});
