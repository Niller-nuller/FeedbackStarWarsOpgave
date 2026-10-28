const express = require("express");
const srcController = require('../controllers/srcController.js');

const routes = express.Router();

routes.get('/', srcController.getAllEntries);
routes.get('/:id', srcController.getById);
routes.post('/', srcController.createEntry);
routes.put('/:id', srcController.updateEntry);
routes.delete('/:id', srcController.deleteEntry);


// add more routes here for other CRUD operations (create, update, delete) as needed


module.exports = routes;