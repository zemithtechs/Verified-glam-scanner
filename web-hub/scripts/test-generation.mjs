import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:3100';
const live = process.argv.includes('--live');
const statusResponse = await fetch(`${base}/api/generate`);
assert.equal(statusResponse.status, 200);
const service = await statusResponse.json();
assert.equal(typeof service.available, 'boolean');
const token = service.token || '';
const outcomes = [];
async function post(name, expected, fields, overrides = {}) {
  const body = new FormData();
  for (const [key, value] of fields) body.append(key, value);
  const response = await fetch(`${base}/api/generate`, { method: 'POST', headers: { Origin: base, 'x-local-generation': token, ...overrides }, body });
  assert.equal(response.status, expected, `${name}: ${response.status} ${await response.text()}`);
  outcomes.push({ name, status: response.status });
}
await post('reject invalid session', 403, [], { 'x-local-generation': 'invalid' });
await post('reject external origin', 403, [], { Origin: 'https://example.org' });
await post('reject remote proxy', 403, [], { 'x-forwarded-for': '203.0.113.7' });
await post('reject unknown tool', 404, [['tool', 'not-a-tool']]);
await post('require consent', 400, [['tool', 'skin-analysis']]);
await post('require an image', 400, [['tool', 'skin-analysis'], ['consent', 'yes']]);
await post('require both images', 400, [['tool', 'face-comparison'], ['consent', 'yes']]);
await post('reject invalid style', 400, [['tool', 'ai-hair-color'], ['consent', 'yes'], ['option', 'unsupported']]);
await post('disable identity matching', 422, [['tool', 'celebrity-look-alike']]);
if (service.available) {
  await post('reject disguised non-image', 415, [['tool', 'skin-analysis'], ['consent', 'yes'], ['image', new Blob(['not an image'], { type: 'image/png' })]]);
}
console.log(JSON.stringify({ configured: service.available, safetyChecks: outcomes }, null, 2));
if (live) {
  assert.ok(service.available, 'Live test requires the locally configured API key.');
  const body = new FormData();
  body.set('tool', 'ai-hair-color'); body.set('consent', 'yes'); body.set('option', 'Copper');
  body.append('image', new Blob([await readFile('media/img/samples/sample-1.png')], { type: 'image/png' }), 'sample-1.png');
  const started = Date.now();
  const response = await fetch(`${base}/api/generate`, { method: 'POST', headers: { Origin: base, 'x-local-generation': token }, body, signal: AbortSignal.timeout(290000) });
  if (!response.ok) throw new Error(`Live generation ${response.status}: ${await response.text()}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  await mkdir('.local-test-results', { recursive: true });
  await writeFile('.local-test-results/hair-color-live.png', bytes);
  console.log(JSON.stringify({ live: 'passed', bytes: bytes.length, seconds: Math.round((Date.now() - started) / 1000), result: '.local-test-results/hair-color-live.png' }));
}
