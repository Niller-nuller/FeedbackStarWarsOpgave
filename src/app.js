const express = require('express');
const logger = require('./middlewares/logger');
const routes = require('./routes/srcRoute');

const app = express();

app.use(express.json());
app.use(logger);

app.use('', routes);
app.use((req, res ) => {
    res.status(404).json({error: 'Page Not Found'})
});

module.exports = app;
