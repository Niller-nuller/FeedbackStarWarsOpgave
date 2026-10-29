const assert = require('node:assert/strict');
const {once} = require('node:events');
const test = require('node:test');
const app = require('../src/app');
const archive = require('../src/data/archive');
const srcService = require('../src/services/srcService');

test('archive API validates requests, exports current data, and redirects to Luke', async () => {
    const server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    let createdId;

    try {
        const invalidBodies = [
            {method: 'POST'},
            {method: 'POST', headers: {'Content-Type': 'application/json'}, body: 'null'},
            {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '[]'},
            {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{invalid'},
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({role: 'Jedi', planet: 'Naboo'}),
            },
            {method: 'PUT'},
            {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: 'null'},
        ];

        for (const options of invalidBodies) {
            const path = options.method === 'PUT' ? '/api/archive/1' : '/api/archive';
            const response = await fetch(`${baseUrl}${path}`, options);
            assert.equal(response.status, 400);
            const errorResponse = await response.json();
            assert.equal(typeof errorResponse.error, 'string');
            if (options.body === '{invalid') {
                assert.equal(errorResponse.error, 'Invalid JSON request body');
            }
        }

        const internalRead = srcService.readAllEntries;
        try {
            srcService.readAllEntries = () => {
                throw new Error('internal detail');
            };
            const response = await fetch(`${baseUrl}/api/archive`);
            assert.equal(response.status, 500);
            assert.deepEqual(await response.json(), {error: 'Server error'});
        } finally {
            srcService.readAllEntries = internalRead;
        }

        const createdResponse = await fetch(`${baseUrl}/api/archive`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: 'Test Character', role: 'Jedi', planet: 'Naboo'}),
        });
        assert.equal(createdResponse.status, 201);
        createdId = (await createdResponse.json()).entry.id;

        const invalidUpdate = await fetch(`${baseUrl}/api/archive/${createdId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: 'null',
        });
        assert.equal(invalidUpdate.status, 400);

        const updatedResponse = await fetch(`${baseUrl}/api/archive/${createdId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: 'Updated Character', role: 'Rebel', planet: 'Hoth'}),
        });
        assert.equal(updatedResponse.status, 200);

        const downloadResponse = await fetch(`${baseUrl}/api/archive/download`);
        assert.equal(downloadResponse.status, 200);
        assert.match(downloadResponse.headers.get('content-type'), /application\/json/);
        assert.match(downloadResponse.headers.get('content-disposition'), /attachment;.*archive\.json/);
        const downloadedEntries = await downloadResponse.json();
        assert.deepEqual(
            downloadedEntries.find((entry) => entry.id === createdId),
            {id: createdId, name: 'Updated Character', role: 'Rebel', planet: 'Hoth'},
        );

        const redirectResponse = await fetch(`${baseUrl}/api/gettoluke`, {redirect: 'manual'});
        assert.equal(redirectResponse.status, 302);
        const lukeId = archive.entries.find((entry) => entry.name === 'Luke Skywalker').id;
        assert.equal(redirectResponse.headers.get('location'), `/api/archive/${lukeId}`);
        const redirectedResponse = await fetch(
            new URL(redirectResponse.headers.get('location'), baseUrl),
        );
        assert.equal(redirectedResponse.status, 200);

        const deletedId = createdId;
        const deleteResponse = await fetch(`${baseUrl}/api/archive/${deletedId}`, {method: 'DELETE'});
        assert.equal(deleteResponse.status, 204);
        assert.equal(await deleteResponse.text(), '');
        createdId = undefined;

        const finalDownload = await fetch(`${baseUrl}/api/archive/download`);
        assert.equal((await finalDownload.json()).some((entry) => entry.id === deletedId), false);

        const originalEntries = archive.entries.slice();
        try {
            archive.entries.splice(
                0,
                archive.entries.length,
                ...originalEntries.filter((entry) => entry.name !== 'Luke Skywalker'),
            );
            const missingLuke = await fetch(`${baseUrl}/api/gettoluke`);
            assert.equal(missingLuke.status, 404);
        } finally {
            archive.entries.splice(0, archive.entries.length, ...originalEntries);
        }
    } finally {
        if (createdId !== undefined) {
            await fetch(`${baseUrl}/api/archive/${createdId}`, {method: 'DELETE'});
        }
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    }
});
