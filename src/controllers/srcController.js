const srcService = require('../services/srcService.js');

function handleError(res, error) {
    const status = error.status || 500;
    res.status(status).json({error: error.message});
}

async function getAllEntries(req, res) {
    try {
        const entries = await srcService.readAllEntries();
        res.status(200).json(entries);
    } catch (error) {
        handleError(res, error);
    }
}

async function getById(req, res) {
    try {
        const entry = await srcService.getEntryById(req.params.id);
        res.status(200).json(entry);
    } catch (error) {
        handleError(res, error);
    }
}

async function createEntry(req, res) {
    try {
        const entry = await srcService.createEntry(req.body);
        res.status(201).json(entry);
    } catch (error) {
        handleError(res, error);
    }
}
async function updateEntry(req, res) {
    try {
        const entry = await srcService.updateEntry(req.params.id, req.body);
        res.status(200).json({ status: "entry has been updated", entry });
    } catch (error) {
        handleError(res, error);
    }
}
async function deleteEntry(req, res) {
    try {
        await srcService.deleteEntry(req.params.id);
        res.status(200).json({ status: "entry has been deleted" });
    } catch (error) {
        handleError(res, error);
    }
}

async function download(req, res) {
    try {
        const entries = await srcService.readAllEntries();
        res.setHeader('Content-Disposition', 'attachment; filename=archive.json');
        res.json(entries);
    } catch (error) {
        handleError(res, error);
    }
}

async function getToLuke(req, res) {
    try {
        const luke = await srcService.findLuke();
        res.redirect(`/archive/${luke._id}`);
    } catch (error) {
        handleError(res, error);
    }
}
module.exports = {
    getAllEntries,
    getById,
    createEntry,
    updateEntry,
    deleteEntry,
    download,
    getToLuke
};
