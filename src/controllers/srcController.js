const srcService = require('../services/srcService.js');

function handleError(res, error) {
    const status = error.status || 500;
    res.status(status).json({error: error.message});
}

function getAllEntries(req, res) {
    res.status(200).json(srcService.readAllEntries());
}

function getById(req, res) {
    try {
        const entry = srcService.getEntryById(req.params.id);
        res.status(200).json(entry);
    } catch (error) {
        handleError(res, error);
    }
}

function createEntry(req, res) {
    try {
        const entry = srcService.createEntry(req.body);
        res.status(201).json({status: "entry has been created", entry});
    } catch (error) {
        handleError(res, error);
    }
}
function updateEntry(req, res) {
    try {
        const entry = srcService.updateEntry(req.params.id, req.body);
        res.status(200).json({status: "entry has been updated", entry});
    } catch (error) {
        handleError(res, error);
    }
}
function deleteEntry(req, res) {
    try {
        srcService.deleteEntry(req.params.id);
        res.status(204).json({status: "entry has been deleted"});
    } catch (error) {
        handleError(res, error);
    }
}

function download(req, res)  {
    const filePath = srcService.downloadFile();
    console.log(filePath)
    res.status(200).download(filePath,'archive.json', (err) => {
        if(err){
            console.error(err);
            if(!res.headersSent) {
                res.status(500).send('Could not find the file');
            }
        }
    });
}

function getToLuke(req, res) {
    const luke = srcService.findLuke();
    res.status(200).redirect(`/archive/${luke.id}`);
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
