const srcService = require('../services/srcService.js');

function handleError(res, error) {
    const status = error.status || 500;
    res.status(status).json({error: error.message});
}

function getAllJedi(req, res) {
    res.status(200).json(srcService.readAllJedi());
}

function getById(req, res) {
    try {
        const jedi = srcService.getJediById(req.params.id);
        res.status(200).json(jedi);
    } catch (error) {
        handleError(res, error);
    }
}

function createJedi(req, res) {
    try {
        const jedi = srcService.createJedi(req.body);
        res.status(201).json({status: "jedi has been created", jedi});
    } catch (error) {
        handleError(res, error);
    }
}
function updateJedi(req, res) {
    try {
        const jedi = srcService.updateJedi(req.params.id, req.body);
        res.status(200).json({status: "jedi has been updated", jedi});
    } catch (error) {
        handleError(res, error);
    }
}
function deleteJedi(req, res) {
    try {
        srcService.deleteJedi(req.params.id);
        res.status(200).json({status: "jedi has been deleted"});
    } catch (error) {
        handleError(res, error);
    }
}

module.exports = {
    getAllJedi,
    getById,
    createJedi,
    updateJedi,
    deleteJedi
}
