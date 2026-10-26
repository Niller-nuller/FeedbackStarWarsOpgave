const express = require('express');
const logger = require('./middlewares/logger');
const routes = require('./routes/srcRoute');

const app = express();

app.use(express.json());
app.use(logger);

//api er bare en placeholder kunne ikke finde en bedre navn lige nu
app.use('/jedi', routes);

module.exports = app;
