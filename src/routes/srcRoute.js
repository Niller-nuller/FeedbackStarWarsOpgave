const express = require("express");
const srcController = require('../controllers/srcController.js');

const routes = express.Router();

routes.get('/', srcController.getAllJedi);
routes.get('/:id', srcController.getById);
routes.post('/', srcController.createJedi);
routes.put('/:id', srcController.updateJedi);
routes.delete('/:id', srcController.deleteJedi);


// add more routes here for other CRUD operations (create, update, delete) as needed


module.exports = routes;