const express = require('express');
const route = express.Router();
const srcController = require('../controllers/srcController.js');

route.get('/jedi', srcController.getAllJedi);

module.exports = route;