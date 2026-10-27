const dataJedi = require('../data/archive.js');

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

    validateRole(role);
    validateName(name);
    validatePlanet(planet);
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

    validateName(name);
    validateRole(role);
    validatePlanet(planet);

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

function validateName(name) {
    if (!name) {
        throw createError(400, 'Name is not given');
    }
    if(typeof name !== 'string') {
        throw createError(400, 'Name is not a string');
    }
    if(!name.trim().length<2) {
        throw createError(400, 'Name must be at least 3 characters');
    }
}

function validateRole(role) {
    if(!role) {
        throw createError(400, 'Role is not given');
    }
    if(typeof role !== 'string') {
        throw createError(400, 'Role is not a string');
    }
    switch(role.toLowerCase()) {
        case 'jedi':
            break;
            case 'sith':
                break;
        case 'smuggler':
            break;
        case 'rebel':
            break;
            default:
                throw createError(400, `${role.toLowerCase()} is not a valid role`);

    }
}

function validatePlanet(planet) {
    if(!planet){
        throw createError(400, 'Planet is not given');
    }
    if(typeof planet === 'string') {
        throw createError(400, 'Planet must be a string');
    }
}



module.exports = {readAllJedi, getJediById, createJedi, updateJedi, deleteJedi};