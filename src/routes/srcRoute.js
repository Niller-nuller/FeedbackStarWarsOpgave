const express = require("express");
const srcController = require('../controllers/srcController.js');

const routes = express.Router();

routes.get('/', srcController.getAllJedi);


module.exports = routes;