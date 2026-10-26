const dataJedi = require('../data/jedi.js');

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function readAllJedi() {
    return dataJedi.jedis;
}
function getJediById(id) {
    const jedi = dataJedi.jedis.find(j => j.id === parseInt(id));
    if (!jedi) {
        throw createError(404, 'Jedi not found');
    }
    return jedi;
}
function createJedi({name, role, planet}) {
    if (!name || !role || !planet) {
        throw createError(400, 'Missing required fields');
    }
    // import rules for the diffent data types here
    const jedi = {
        id: dataJedi.getNextId(),
        name,
        role,
        planet
    };
    dataJedi.jedis.push(jedi);
    return jedi;
}
function updateJedi(id, {name, role, planet}) {
    const jedi = getJediById(id);

    if (!name || !role || !planet) {
        throw createError(400, 'Missing required fields');
    }
    jedi.name = name;
    jedi.role = role;
    jedi.planet = planet;
    return jedi;
}
function deleteJedi(id) {
    const index = dataJedi.jedis.findIndex(j => j.id === parseInt(id));
    if (index === -1) {
        throw createError(404, 'Jedi not found');
    }
    dataJedi.jedis.splice(index, 1);
}




module.exports = {readAllJedi, getJediById, createJedi, updateJedi, deleteJedi};