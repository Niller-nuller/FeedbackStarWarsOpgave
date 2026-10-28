const express = require("express");
const srcController = require('../controllers/srcController.js');

const routes = express.Router();

routes.get('/archive', srcController.getAllEntries);
routes.get('/archive/download', srcController.download);
routes.get('/gettoluke', srcController.getToLuke);
routes.post('/archive', srcController.createEntry);
routes.get('/archive/:id', srcController.getById);
routes.put('/archive/:id', srcController.updateEntry);
routes.delete('/archive/:id', srcController.deleteEntry);


// add more routes here for other CRUD operations (create, update, delete) as needed


module.exports = routes;