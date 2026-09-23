// Run against a disposable database: node backend/tests/categories.integration.mjs http://localhost:5088
// Creates two test users. No npm dependencies are required (Node 18+).
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const baseUrl = process.argv[2] ?? 'http://localhost:5088';
let assertions = 0;
async function request(method, path, status, token, body) {
    const response = await fetch(`${baseUrl}/api/${path}`, {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const text = await response.text();
    if (status !== null) {
        assert.equal(response.status, status, `${method} ${path}: ${text}`);
        assertions++;
    }
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: response.status, data, location: response.headers.get('location') };
}

async function createUser() {
    const email = `categories-${randomUUID()}@example.com`;
    const password = 'CategoryTest123!';
    await request('POST', 'auth/register', 201, null,
        { email, password, passwordConfirmation: password });
    return (await request('POST', 'auth/login', 200, null, { email, password })).data.token;
}

const alice = await createUser();
const bob = await createUser();
for (const [method, path, body] of [
    ['GET', 'categories'], ['GET', 'categories/-1'],
    ['POST', 'categories', { name: 'Pets' }],
    ['PUT', 'categories/-1', { name: 'Pets' }], ['DELETE', 'categories/-1'],
]) await request(method, path, 401, null, body);

const defaults = (await request('GET', 'categories', 200, alice)).data;
assert.deepEqual(defaults.map(c => c.name).sort(), [
    'Food', 'Transport', 'Housing', 'Entertainment', 'Shopping',
    'Health', 'Education', 'Subscriptions', 'Other',
].sort());
assert(defaults.every(c => c.isDefault));
assert.deepEqual((await request('GET', 'categories', 200, bob)).data, defaults);
for (const category of defaults) {
    await request('PUT', `categories/${category.id}`, 403, alice, { name: 'Changed' });
    await request('DELETE', `categories/${category.id}`, 403, alice);
}

for (const body of [{}, { name: null }, { name: '' }, { name: ' \t\n ' }, { name: 'x'.repeat(101) }]) {
    await request('POST', 'categories', 400, alice, body);
}
const created = await request('POST', 'categories', 201, alice,
    { name: '  Pets  ', userId: 999999, isDefault: true });
const pets = created.data;
assert.equal(pets.name, 'Pets');
assert.equal(pets.isDefault, false);
assert(created.location.endsWith(`/api/categories/${pets.id}`));
assert.deepEqual((await request('GET', `categories/${pets.id}`, 200, alice)).data, pets);
await request('POST', 'categories', 409, alice, { name: ' pETS ' });
await request('POST', 'categories', 201, bob, { name: 'Pets' });

assert(!(await request('GET', 'categories', 200, bob)).data.some(c => c.id === pets.id));
await request('GET', `categories/${pets.id}`, 404, bob);
await request('PUT', `categories/${pets.id}`, 404, bob, { name: 'Stolen' });
await request('DELETE', `categories/${pets.id}`, 404, bob);
await request('PUT', `categories/${pets.id}`, 400, alice, { name: ' ' });
await request('PUT', `categories/${pets.id}`, 204, alice, { name: ' pETS ' });
const travel = (await request('POST', 'categories', 201, alice, { name: 'Travel' })).data;
await request('PUT', `categories/${pets.id}`, 409, alice, { name: 'travel' });
await request('PUT', `categories/${pets.id}`, 204, alice, { name: '  Animals  ' });
assert.equal((await request('GET', `categories/${pets.id}`, 200, alice)).data.name, 'Animals');

const concurrent = await Promise.all(Array.from({ length: 8 }, () =>
    request('POST', 'categories', null, alice, { name: 'Concurrent' })));
assert.equal(concurrent.filter(r => r.status === 201).length, 1);
assert.equal(concurrent.filter(r => r.status === 409).length, 7);

await request('DELETE', `categories/${pets.id}`, 204, alice);
await request('GET', `categories/${pets.id}`, 404, alice);
await request('DELETE', `categories/${pets.id}`, 404, alice);
await request('PUT', `categories/${pets.id}`, 404, alice, { name: 'Missing' });
await request('POST', 'categories', 201, alice, { name: 'Animals' });
await request('DELETE', `categories/${travel.id}`, 204, alice);
assert.deepEqual((await request('GET', 'categories', 200, alice)).data.filter(c => c.isDefault), defaults);
console.log(`Categories integration tests passed (${assertions} HTTP status checks plus data assertions and concurrency).`);
