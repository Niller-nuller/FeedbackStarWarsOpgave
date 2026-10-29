const srcService = require('../services/srcService.js');

function getAllEntries(req, res) {
    res.status(200).json(srcService.readAllEntries());
}

function getById(req, res) {
    const entry = srcService.getEntryById(req.params.id);
    res.status(200).json(entry);
}

function createEntry(req, res) {
    const entry = srcService.createEntry(req.body);
    res.status(201).json({status: "entry has been created", entry});
}
function updateEntry(req, res) {
    const entry = srcService.updateEntry(req.params.id, req.body);
    res.status(200).json({status: "entry has been updated", entry});
}
function deleteEntry(req, res) {
    srcService.deleteEntry(req.params.id);
    res.status(204).end();
}

function download(req, res) {
    res.attachment('archive.json').json(srcService.readAllEntries());
}

function getToLuke(req, res) {
    const luke = srcService.findLuke();
    res.redirect(`/api/archive/${luke.id}`);
}
module.exports = {
    getAllEntries,
    getById,
    createEntry,
    updateEntry,
    deleteEntry,
    download,
    getToLuke
}
