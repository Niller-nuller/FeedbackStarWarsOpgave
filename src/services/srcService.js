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
    const jedi = datajedi.jedis.find(j => j.id === parseInt(id));
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



module.exports = {readAllJedi, getJediById};