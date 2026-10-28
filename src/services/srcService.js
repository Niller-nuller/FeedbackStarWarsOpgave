const archiveEntries = require('../data/archive.js');
const {entries} = require("../data/archive");
const {name} = require("express/lib/view");
const path = require('path')

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function readAllEntries() {
    return archiveEntries.entries;
}
function getEntryById(id) {
    const entry = archiveEntries.entries.find(j => j.id === parseInt(id));
    if (!entry) {
        throw createError(404, `entry not found with requested id of: ${id}`);
    }
    return entry;
}
function createEntry({name, role, planet}) {

    validateName(name);
    validateRole(role);
    validatePlanet(planet);
    // import rules for the diffent data types here
    const entry = {
        id: archiveEntries.getNextId(),
        name,
        role,
        planet
    };
    archiveEntries.entries.push(entry);
    return entry;
}
function updateEntry(id, {name, role, planet}) {
    const entry = getEntryById(id);

    validateName(name);
    validateRole(role);
    validatePlanet(planet);

    entry.name = name;
    entry.role = role;
    entry.planet = planet;
    return entry;
}
function deleteEntry(id) {
    const index = archiveEntries.entries.findIndex(j => j.id === parseInt(id));
    if (index === -1) {
        throw createError(404, 'entry not found');
    }
    archiveEntries.entries.splice(index, 1);
}

function validateName(name) {
    if (!name) {
        throw createError(400, 'Name is not given');
    }
    if(typeof name !== 'string') {
        throw createError(400, 'Name is not a string');
    }
    if(name.trim().length < 3) {
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
    if(typeof planet !== 'string') {
        throw createError(400, 'Planet must be a string');
    }
}

function downloadFile(){
    return path.join(__dirname, '../data/archive.json');
}

function findLuke(){
    const name = "Luke Skywalker"
    const luke = archiveEntries.entries.find(entry => entry.name === name);
    if(luke === undefined){
        throw createError(500, "Luke is missing!");
    }
    return luke;
}



module.exports = {readAllEntries, getEntryById, createEntry, updateEntry, deleteEntry,downloadFile ,findLuke};