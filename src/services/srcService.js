const Entry = require('../data/archive');
const mongoose = require('mongoose');
const path = require('path')

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
function checkId(id) {
    if (!mongoose.isValidObjectId(id)) {
        throw createError(400, `${id} is not a valid id`);
    }
}

async function readAllEntries() {
    return await Entry.find()
}
async function getEntryById(id) {
    checkId(id);
    const entry = await Entry.findById(id)
    if (!entry) {
        throw createError(404, `entry not found with requested id of: ${id}`);
    }
    return entry;
}
async function createEntry({name, role, planet}) {

    validateName(name);
    validateRole(role);
    validatePlanet(planet);

    return await Entry.create({ name, role, planet});
}
async function updateEntry(id, {name, role, planet}) {
    checkId(id);
    validateName(name);
    validateRole(role);
    validatePlanet(planet);

    const entry = await Entry.findByIdAndUpdate(
        id,
        { name, role, planet },
        { new: true, runValidators: true }
    );
    if (!entry) {
        throw createError(404, `entry not found with requested id of: ${id}`);
    }
    return entry;
}

async function deleteEntry(id) {
    checkId(id);
    const entry = await Entry.findByIdAndDelete(id);
    if (!entry) {
        throw createError(404, 'entry not found');
    }
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


async function findLuke() {
    const luke = await Entry.findOne({ name: "Luke Skywalker" });
    if (!luke) {
        throw createError(500, "Luke is missing!");
    }
    return luke;
}

module.exports = { readAllEntries, getEntryById, createEntry, updateEntry, deleteEntry, downloadFile, findLuke };